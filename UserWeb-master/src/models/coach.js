import Axios from 'axios';
import Logger from '../services/Logger';
import AuraContent from '../services/AuraContent';
import contentConstants from '../utils/constants/content';
import { getChannel } from './channel';
import Auth from '../services/Auth';
import config from '../config';
import FirebaseDatabase from '../services/FirebaseDatabase';
import { notifyAPIError } from '../services/ErrorMonitoring';

// Coaches list changes rarely and is largely user-agnostic, so we cache the
// SSR result in the server-side NodeCache to avoid re-reading the full Firebase
// `/coaches` node (or re-fetching the CDN list) on every request. Short TTL
// (config.cache.coachesListTTL) keeps the default-locale (bypassCDN) path fresh.
//
// `listCoaches` runs both server-side (getServerSideProps) and client-side
// (redux `getAllCoaches` thunk, `bookableCoaches` hook). The NodeCache lives in
// the custom server and must never reach the browser: the `typeof window` guard
// is statically eliminated from the client build by Next's webpack DCE, so the
// require is dropped there and this returns null; on the server it resolves.
function getCoachesCache() {
  if (typeof window === 'undefined') {
    try {
      // eslint-disable-next-line global-require
      return require('../../server/services/Cache');
    } catch (error) {
      // Cache is a best-effort optimization; degrade to the uncached path but
      // log so a broken require doesn't silently disable caching forever.
      Logger.warn('Unable to load coaches cache; serving uncached', { error });
      return null;
    }
  }
  return null;
}

function isCoachActive(coach) {
  if (!coach) return false;
  const {
    approved,
    bookable,
    deleted,
    videoCoachingApproved,
    communityEnabledAt,
  } = coach;
  return (
    (approved || bookable || videoCoachingApproved || communityEnabledAt) &&
    !deleted
  );
}

async function getCoach(id) {
  try {
    const coach = await FirebaseDatabase.getValue(`/coaches/${id}`);
    if (isCoachActive(coach)) {
      coach.id = id;
      return coach;
    }
  } catch (error) {
    Logger.error('Error fetching coach', { error });
  }
  return null;
}

async function getCoachFromSlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const coachId = await FirebaseDatabase.getValue(
      `/slugCoach/${encodedSlug}`
    );
    if (!coachId) {
      Logger.warn('Error fetching coach - coach slug not found', {
        slug,
        encodedSlug,
      });
      return null;
    }
    return await getCoach(coachId);
  } catch (error) {
    Logger.error('Error fetching coach', { error });
  }
  return null;
}

async function getCoachTracks({
  limit = 25,
  authorId,
  authorName,
  locale,
  preferredLocale,
} = {}) {
  if (!authorId && !authorName) {
    Logger.warn('Error fetching tracks: missing arguments');
    return null;
  }
  try {
    return AuraContent.getTracks({
      limit,
      useDayBucket: false,
      durationFilter: contentConstants.DURATION_KEYS.ALL,
      author: authorId,
      authorName,
      locale,
      preferredLocale,
      useOnlyPopular: true,
    });
  } catch (error) {
    Logger.error('Error fetching coach tracks', { error });
  }
  return null;
}
async function getCoachTracksByCategory({
  limit = 25,
  coachId,
  authorName,
  category,
  useOnlyPopular,
  sinceDays,
  locale,
  preferredLocale,
} = {}) {
  if (!coachId && !authorName) {
    Logger.warn('Error fetching tracks: missing arguments');
    return null;
  }
  try {
    return AuraContent.getTracks({
      limit,
      useDayBucket: false,
      author: coachId,
      category,
      sinceDays,
      useOnlyPopular,
      locale,
      preferredLocale,
    });
  } catch (error) {
    Logger.error('Error fetching coach tracks', { error });
  }
  return null;
}

async function getCoachTracksByType({
  limit = 25,
  coachId,
  authorName,
  type,
  locale,
  preferredLocale,
} = {}) {
  if (!coachId && !authorName) {
    Logger.warn('Error fetching tracks: missing arguments');
    return null;
  }
  try {
    const tracks = AuraContent.getTracks({
      limit,
      useDayBucket: false,
      author: coachId,
      contentType: type,
      locale,
      preferredLocale,
    });
    return tracks;
  } catch (error) {
    Logger.error('Error fetching coach tracks', { error });
  }
  return null;
}

async function listCoachTracksByType({
  types,
  coachId,
  locale,
  preferredLocale,
}) {
  Logger.debug(`types: list`, { types });
  const promises = types.map((type) =>
    getCoachTracksByType({ type, coachId, locale, preferredLocale })
  );
  return Promise.all(promises);
}

async function searchCoachTracks({
  contentType,
  topic,
  duration,
  limit = 25,
  authorId,
  authorName,
} = {}) {
  if (!authorId && !authorName) {
    Logger.warn('Error fetching tracks: missing arguments');
    return null;
  }
  try {
    return AuraContent.getTracks({
      limit,
      useDayBucket: false,
      durationFilter: contentConstants.DURATION_KEYS[duration],
      category: contentConstants.CONTENT_CATEGORY.SEARCH,
      author: authorId,
      authorName,
      contentType,
      topic,
    });
  } catch (error) {
    Logger.error('Error fetching coach tracks', { error });
  }
  return null;
}

async function listCoaches({ bypassCDN = false, locale } = {}) {
  // Only cache the bypassCDN (full Firebase `/coaches` node) path — the OOM
  // driver. The CDN path is already backed by AuraCDN's 12h NodeCache, so a
  // second layer here would just be redundant.
  const cache = bypassCDN ? getCoachesCache() : null;
  const cacheKey = `coachesList:firebase:${locale || 'default'}`;
  if (cache) {
    const cached = cache.get(cacheKey);
    if (cached) {
      Logger.debug('Coaches list cache hit', { cacheKey });
      return cached;
    }
  }
  try {
    let value;
    let fetchFirebase = !!bypassCDN;
    if (!bypassCDN) {
      Logger.debug('Fetching coaches list from API');
      try {
        const response = await Axios.get(`${config.api.baseUrl}/coaches/list`, {
          params: { locale },
        });
        value = response.data;
      } catch (error) {
        Logger.debug(`Unable to fetch from CDN: ${error}`);
      }
      // Fallback to Firebase if API fetch fails
      if (!value) fetchFirebase = true;
    }
    if (fetchFirebase) {
      Logger.warn('Fetching coaches list from firebase');
      value = await FirebaseDatabase.getValue(`/coaches`);
    }
    if (value) {
      const coaches = Object.keys(value).map((coach) => {
        return {
          id: coach,
          ...value[coach],
        };
      });
      let filteredCoaches = coaches;
      // The filtered coaches contain all the coaches that have been approved
      filteredCoaches = coaches.map(async (coach) => {
        if (!isCoachActive(coach)) {
          return null;
        }
        if (coach.type === 'celebrity') return null;
        return coach;
      });
      filteredCoaches = await Promise.all(filteredCoaches);

      filteredCoaches = filteredCoaches.filter((x) => {
        return !!x && !!x.name;
      });

      filteredCoaches.sort((a, b) => {
        if (!b.followersCount) return -1;
        return b.followersCount - a.followersCount;
      });
      if (cache) {
        // The cache uses `useClones: false`, so this exact array/object
        // reference is handed to every cache hit. Callers must treat the
        // result as immutable — mutating it in place would corrupt the entry
        // for all subsequent requests.
        cache.set(cacheKey, filteredCoaches, config.cache.coachesListTTL);
      }
      return filteredCoaches;
    }
    Logger.debug('Fetched coaches list', { bypassCDN });
  } catch (err) {
    Logger.error('error fetching coaches', err);
  }
  return null;
}

async function getCoachChannels(ids) {
  Logger.debug(`coaching channels: list`, { ids });
  const promises = ids.map((id) => getChannel(id));
  let coachChannels = await Promise.all(promises);
  coachChannels = coachChannels.filter((channel) => {
    return channel != null;
  });
  return coachChannels;
}

function getCoachPhoto(coach, size) {
  const coachPhotoUrl = `https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb`;
  if (!coach) {
    return coachPhotoUrl;
  }
  if (size && coach.profilePictureThumbs && coach.profilePictureThumbs[size]) {
    return coach.profilePictureThumbs[size];
  }
  if (coach.profilePicture) {
    return coach.profilePicture;
  }
  return coachPhotoUrl;
}

function getCoachName(coach) {
  return coach?.name || 'Aura';
}

function getCoachProfessionalTitle(coach) {
  return coach?.professionalTitle || '';
}

async function getCountriesList() {
  try {
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/addresses/countries`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching countries list' });
    return { error };
  }
  return { error: 'Countries Fetch Failed' };
}

async function getCoachIdFromSlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const coachId = await FirebaseDatabase.getValue(
      `/slugCoach/${encodedSlug}`
    );
    if (!coachId) {
      Logger.warn('Error fetching coach - coach slug not found', {
        slug,
        encodedSlug,
      });
      return null;
    }
    return coachId;
  } catch (error) {
    Logger.error('Error fetching coach', { error });
  }
  return null;
}

function getCoachFirstName(coach) {
  const splitName = coach?.name?.split(' ') || ['Aura'];
  const [firstName, secondName] = splitName;
  if (firstName && firstName.endsWith('.') && secondName) {
    return `${firstName} ${secondName}`;
  }
  return firstName;
}

async function listCoachAvailableSlots(
  coachId,
  duration,
  sessionTypeId,
  to,
  from
) {
  const authToken = await Auth.getUserAuthToken();
  const data = {
    coachIds: [coachId],
    duration,
    sessionTypeId,
    to,
    from,
  };
  Logger.debug('List coach availability', { data, authToken });
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/availability/list`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data,
    };
    const response = await Axios(options);
    Logger.debug('Fetched coach availability', { response });
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching coach availability' });
    return { error };
  }
  return { error: 'Error fetching coach availability' };
}

function getAvailableCoachingSpots(coach) {
  if (!coach) return 0;
  const { maxCoachingClients = 0, coachingClientsCount = 0 } = coach;
  return Math.max(0, maxCoachingClients - coachingClientsCount);
}

function getCoachesListByID(ids) {
  Logger.debug(`ids: list`, { ids });
  const promises = ids.map((id) => getCoach(id));
  return Promise.all(promises);
}

async function getCoachSchedulingDetails(coachId) {
  const authToken = await Auth.getUserAuthToken();

  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/scheduling/coaches/${coachId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.status === 200 && response.data) {
      return response?.data;
    }
    return null;
  } catch (error) {
    notifyAPIError(error, {
      message: 'Error while fetching coach scheduling details',
    });
    return null;
  }
}

async function getCoachPackages(coachId) {
  const authToken = await Auth.getUserAuthToken();

  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/coaching/coachPackages/list`,
      data: {
        coachId,
        includeInactive: false,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.status === 200 && response.data) {
      return response?.data;
    }
    return null;
  } catch (error) {
    notifyAPIError(error, {
      message: 'Error while fetching coach packages',
    });
    return null;
  }
}

export {
  isCoachActive,
  getCoach,
  getCoachFromSlug,
  getCoachTracks,
  listCoaches,
  getCoachChannels,
  getCoachPhoto,
  getCoachName,
  getCoachProfessionalTitle,
  getCountriesList,
  getCoachIdFromSlug,
  getCoachFirstName,
  getCoachTracksByCategory,
  searchCoachTracks,
  getCoachTracksByType,
  listCoachTracksByType,
  listCoachAvailableSlots,
  getAvailableCoachingSpots,
  getCoachesListByID,
  getCoachSchedulingDetails,
  getCoachPackages,
};
