import Axios from 'axios';
import config from '../config';
import Auth from '../services/Auth';
import FirebaseDatabase from '../services/FirebaseDatabase';
import { notifyAPIError } from '../services/ErrorMonitoring';
import Logger from '../services/Logger';
import { getPost } from './post';

function isTrackActive(track) {
  if (!track) return false;
  const { deleted, approved } = track;
  return !deleted && approved;
}

async function listMeditations(ids) {
  Logger.debug(`meditations: list`, { ids });
  const promises = ids.map((id) => getMeditation(id));
  return Promise.all(promises);
}

async function getMeditationIdFromSlug(slug) {
  const encodedSlug = encodeURIComponent(slug);
  const trackId = await FirebaseDatabase.getValue(
    `/slugMeditation/${encodedSlug}`
  );
  return trackId;
}

async function getMeditation(id) {
  Logger.debug(`meditations: get ${id}`);
  const meditation = await FirebaseDatabase.getValue(`/meditations/${id}`);

  if (isTrackActive(meditation)) {
    meditation.id = id;
    delete meditation.addedToIndex;
    delete meditation.micro;
    delete meditation.crawlPassed;
    delete meditation.skipCrawl;
    delete meditation.meditationFeedback;
    delete meditation.savedUsers;
    delete meditation.transcription;
    delete meditation.transcription7;
    return meditation;
  }
  return null;
}

async function getMeditationPosts(id) {
  Logger.debug(`MeditationPosts: list ${id}`);
  const reviews = await FirebaseDatabase.getValue(`/reviewsIndices/${id}`);
  if (!reviews) {
    return [];
  }
  const promises = Object.keys(reviews)
    .slice(0, 11)
    .map((key) => getPost(key));
  return Promise.all(promises);
}

function getMeditationPhoto(meditation, size) {
  const auraTrackPic = `https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb`;
  if (!meditation) {
    return auraTrackPic;
  }
  if (size && meditation.photoThumbs && meditation.photoThumbs[size]) {
    return meditation.photoThumbs[size];
  }
  if (meditation.photoUrl) {
    return meditation.photoUrl;
  }
  if (meditation.channel && meditation.channel.channelPicture) {
    return meditation.channel.channelPicture;
  }
  if (meditation.photo) {
    return meditation.photo;
  }
  return auraTrackPic;
}

function getMeditationDisplayDuration(secs) {
  const mins = Math.round(secs / 60);
  return parseInt(mins, 10);
}

function getTrackUrl(meditation, durationMode = 3) {
  if (!meditation) {
    return null;
  }

  let trackUrl = meditation.url;
  if (durationMode === 7 && meditation.url7) {
    trackUrl = meditation.url7;
  }
  return trackUrl;
}

function getTrackTitle(meditation) {
  return meditation?.title || '';
}

function getSecondsDuration(meditation, durationMode = 3) {
  if (!meditation) {
    return 0;
  }

  let durationInSeconds = meditation.duration;
  if (durationMode === 7 && meditation.duration7) {
    durationInSeconds = meditation.duration7;
  }
  return durationInSeconds;
}

function getSimplifiedDuration(meditation, durationMode = 3) {
  if (!meditation) {
    return 0;
  }

  let durationInSeconds = meditation.duration;
  if (durationMode === 7 && meditation.duration7) {
    durationInSeconds = meditation.duration7;
  }
  return Math.round(durationInSeconds / 60);
}

function getChannelPhotoUrl(meditation) {
  let channelPhotoUrl = `https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb`;
  if (
    meditation &&
    meditation.channel &&
    meditation.channel.channelPictureThumbs &&
    meditation.channel.channelPictureThumbs.photo200Url
  ) {
    return meditation.channel.channelPictureThumbs.photo200Url;
  }
  if (meditation && meditation.channel && meditation.channel.channelPicture) {
    channelPhotoUrl = meditation.channel.channelPicture;
  }

  return channelPhotoUrl;
}

function getChannelAuthorName(meditation) {
  let channelAuthorName = `Aura`;
  if (meditation && meditation.channel && meditation.channel.authorName) {
    channelAuthorName = meditation.channel.authorName;
  }
  return channelAuthorName;
}

function trackTypeDisplayStringFromId(trackType, isCBT) {
  let trackTypeName = trackType;
  switch (trackType) {
    case `meditation`:
      trackTypeName = `Meditation`;
      break;
    case `mindfulness`:
      trackTypeName = `Meditation`;
      break;
    case `lifeCoaching`:
      trackTypeName = `Life Coaching`;
      break;
    case `story`:
      trackTypeName = `Story`;
      break;
    case `music`:
      trackTypeName = `Music`;
      break;
    case `therapy`:
      trackTypeName = isCBT ? 'CBT' : `Healthy Mind`;
      break;
    case `video`:
      trackTypeName = `Video`;
      break;
    case `visualStory`:
      trackTypeName = `Visual Story`;
      break;
    case `article`:
      trackTypeName = `Article`;
      break;
    case `community`:
      trackTypeName = `Community`;
      break;
    case `soundscape`:
      trackTypeName = `Soundscape`;
      break;
    case `asmr`:
      trackTypeName = `ASMR`;
      break;
    case `hypnosis`:
      trackTypeName = `Hypnosis`;
      break;
    case `breathwork`:
      trackTypeName = `Breathwork`;
      break;
    case `poem`:
      trackTypeName = `Poem`;
      break;
    case `spirituality`:
      trackTypeName = `Spirituality`;
      break;
    case `emotionalIntelligence`:
      trackTypeName = `Emotional Intelligence`;
      break;
    case 'podcast':
      trackTypeName = 'Podcast';
      break;
    case 'course':
      trackTypeName = 'Course';
      break;
    case 'energyHealing':
      trackTypeName = 'Alternative Healing';
      break;
    case `natureSounds`:
      trackTypeName = `Nature Sounds`;
      break;
    case `series`:
      trackTypeName = `Series`;
      break;
    case `workWellness`:
      trackTypeName = `Work Wellness`;
      break;
    case `healthCoaching`:
      trackTypeName = `Health Coaching`;
      break;
    case `sexualHealth`:
      trackTypeName = `Intimacy & Relationships`;
      break;
    case `diversityAndInclusion`:
      trackTypeName = `Diversity & Inclusion`;
      break;
    case `motivation`:
      trackTypeName = `Motivation`;
      break;
    case `affirmations`:
      trackTypeName = `Affirmations`;
      break;
    case `personalStory`:
      trackTypeName = `Personal Story`;
      break;
    default:
      trackTypeName = `Meditation`;
      break;
  }
  return trackTypeName;
}

function getChannelAuthorPhoto(meditation, imageSize = 'photo100Url') {
  let authorPhotoUrl;
  if (
    meditation &&
    meditation.channel &&
    meditation.channel.authorPhotoThumbs &&
    meditation.channel.authorPhotoThumbs[imageSize]
  ) {
    return meditation.channel.authorPhotoThumbs[imageSize];
  }
  if (meditation && meditation.channel && meditation.channel.authorPhoto) {
    authorPhotoUrl = meditation.channel.authorPhoto;
  }
  return authorPhotoUrl;
}

function getChannelName(meditation) {
  let channelName = `Aura`;

  if (meditation && meditation.channel && meditation.channel.channelName) {
    ({ channelName } = meditation.channel);
  }
  return channelName;
}

function filterActiveTracks(tracks = []) {
  if (typeof tracks.filter === 'function') {
    return tracks.filter((element) => {
      return isTrackActive(element);
    });
  }
  return tracks;
}

async function getCategoryDetails(id) {
  const categoryDetail = await FirebaseDatabase.getValue(`/categories/${id}`);
  return categoryDetail;
}

async function getPrograms() {
  const programs = await FirebaseDatabase.getValue(`/meditationPrograms`);
  return programs;
}

async function listSeries() {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/series/list`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    Logger.debug('Fetched list series', { response });
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching list series' });
    return { error };
  }
  return { error: 'Error fetching list series' };
}

async function getMeditationCount(data) {
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/contents/count`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching track count' });
    return { error };
  }
  return { error: 'Error fetching track count' };
}

async function getMeditationList(data) {
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/contents/list`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching track list' });
    return { error };
  }
  return { error: 'Error fetching track list' };
}
async function getContentById(id) {
  try {
    const options = {
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/contents/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching content by Id' });
    return { error };
  }
  return { error: 'Error fetching content by Id' };
}

async function addCustomPlaylist(data, id) {
  const firebasePushKey = await FirebaseDatabase.generateId(
    `customPlaylist/${id}/`
  );
  let res = null;
  if (id) {
    res = await FirebaseDatabase.setValue(
      `/customPlaylist/${id}/${firebasePushKey}`,
      data
    );
  }
  return res;
}

function getTrackMetaImages(track, coachDetails) {
  if (!track || !coachDetails) return {};
  const {
    name: coachName,
    profileBgRemovedPicture,
    professionalTitle,
  } = coachDetails || {};

  const { trackType, duration, photoUrl } = track || {};

  const trackOgImageUrl = new URL(`${config.appDomain}/api/og/track`);
  trackOgImageUrl.searchParams.append('coachName', coachName);
  trackOgImageUrl.searchParams.append(
    'coachProfileImage',
    profileBgRemovedPicture
  );
  trackOgImageUrl.searchParams.append(
    'coachProfessionalTitle',
    professionalTitle
  );
  trackOgImageUrl.searchParams.append('title', getTrackTitle(track));
  trackOgImageUrl.searchParams.append('trackImage', photoUrl);
  trackOgImageUrl.searchParams.append(
    'duration',
    getMeditationDisplayDuration(duration)
  );
  trackOgImageUrl.searchParams.append(
    'type',
    trackTypeDisplayStringFromId(trackType)
  );

  const ogImage = trackOgImageUrl.toString();
  trackOgImageUrl.searchParams.append('landScapeImage', true);
  const ogImageLandScape = trackOgImageUrl.toString();
  return {
    ogImage,
    ogImageLandScape,
  };
}

export {
  isTrackActive,
  getMeditation,
  listMeditations,
  getMeditationPhoto,
  getMeditationPosts,
  getMeditationDisplayDuration,
  getTrackTitle,
  getTrackUrl,
  getSecondsDuration,
  getSimplifiedDuration,
  getChannelPhotoUrl,
  getChannelAuthorName,
  trackTypeDisplayStringFromId,
  getChannelAuthorPhoto,
  getChannelName,
  filterActiveTracks,
  getMeditationIdFromSlug,
  getCategoryDetails,
  getPrograms,
  listSeries,
  getMeditationCount,
  getMeditationList,
  getContentById,
  addCustomPlaylist,
  getTrackMetaImages,
};
