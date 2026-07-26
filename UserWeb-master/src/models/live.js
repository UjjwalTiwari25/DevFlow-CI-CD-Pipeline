import Axios from 'axios';
import { addMinutes } from 'date-fns';
import BACKGROUND_GRADIENTS from '@/data/backgroundGradient.json';
import { displayInTimezone } from '@/utils/date';
import Auth from '../services/Auth';

import config from '../config';
import { notifyAPIError } from '../services/ErrorMonitoring';

async function getCoachLiveEvents(coachId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/scheduling/live/list`,
      headers: {
        Authorization: `Bearer ${authToken || config.authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
      data: { coachId, start: new Date().toISOString() },
    };
    const response = await Axios(options);

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching Events List' });
    return { error };
  }
  return { error: 'Events List Fetch Failed' };
}

async function getLiveEvent(eventId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/scheduling/live/${eventId}`,
      headers: {
        Authorization: `Bearer ${authToken || config.authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching event' });
    return { error };
  }
  return { error: 'event Fetch Failed' };
}

async function reserveLiveEvent({ liveEventId }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'PUT',
      url: `${config.api.auraServices}/scheduling/live/${liveEventId}/reserve`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Error setting event' });
    return { error };
  }
  return { error: 'event setting Failed' };
}

function getLiveMetaImages(liveEventDetails, coachDetails) {
  if (!liveEventDetails || !coachDetails) return {};
  const {
    previewCardsBackground: { liveEventPreviewBackround = 'night_fade' } = {},
    name: coachName,
    slug: coachslug,
    profileBgRemovedPicture,
    professionalTitle,
  } = coachDetails || {};

  const { title, scheduledAt, duration } = liveEventDetails || {};

  const auraLiveOgImageUrl = new URL(`${config.appDomain}/api/og/auraLive`);
  auraLiveOgImageUrl.searchParams.append('coachName', coachName);
  auraLiveOgImageUrl.searchParams.append('coachslug', coachslug);
  auraLiveOgImageUrl.searchParams.append(
    'coachProfileImage',
    profileBgRemovedPicture
  );
  auraLiveOgImageUrl.searchParams.append(
    'coachProfessionalTitle',
    professionalTitle
  );
  auraLiveOgImageUrl.searchParams.append('liveName', title);
  if (new Date(scheduledAt) >= new Date()) {
    auraLiveOgImageUrl.searchParams.append(
      'liveTime',
      `${displayInTimezone(
        new Date(scheduledAt),
        'PST',
        'MMM dd, h:mm-'
      )}${displayInTimezone(
        addMinutes(new Date(scheduledAt), duration),
        'PST',
        'h:mmaaa'
      )} PST`
    );
  }
  auraLiveOgImageUrl.searchParams.append(
    'backgroundColor',
    BACKGROUND_GRADIENTS[liveEventPreviewBackround]
  );
  const ogImage = auraLiveOgImageUrl.toString();
  auraLiveOgImageUrl.searchParams.append('landScapeImage', true);
  const ogImageLandScape = auraLiveOgImageUrl.toString();
  return {
    ogImage,
    ogImageLandScape,
  };
}

export {
  getCoachLiveEvents,
  getLiveEvent,
  reserveLiveEvent,
  getLiveMetaImages,
};
