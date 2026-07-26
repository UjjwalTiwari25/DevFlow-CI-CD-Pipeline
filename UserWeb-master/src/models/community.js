import Auth from '@/services/Auth';
import config from '@/config';
import { notifyAPIError } from '@/services/ErrorMonitoring';
import axios from 'axios';
import Logger from '@/services/Logger';
import FirebaseDatabase from '@/services/FirebaseDatabase';

function isCommunityActive(community) {
  if (!community) return false;
  const { approved } = community;
  return approved;
}

function getCommunityLogo(community) {
  const communityLogoUrl = `https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/auraTrackPic.png?alt=media&token=06b53bb7-8f44-4da0-a47a-82d94c030fbb`;
  if (!community) {
    return communityLogoUrl;
  }

  if (community.logo) {
    return community.logo;
  }
  return communityLogoUrl;
}

async function getCommunityById(communityId) {
  if (!communityId) return null;
  try {
    const value = await FirebaseDatabase.getValue(
      `/communities/${communityId}`
    );
    if (value !== null) {
      return value;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch community' });
    return { error };
  }
  return { error: 'Failed to fetch community' };
}

async function getCommunityByIdFromDatabase(communityId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/communities/${communityId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      if (isCommunityActive(response.data)) {
        return response.data;
      }
      return null;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch community' });
    return { error };
  }
  return { error: 'Failed to fetch community' };
}

async function getAllCommunityCoaches(communityId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/communities/coaches/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      data: { communityId },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch community coaches' });
    return { error };
  }
  return { error: 'Failed to fetch community coaches' };
}

async function getCommunityFromSlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const communityId = await FirebaseDatabase.getValue(
      `/slugCommunity/${encodedSlug}`
    );

    if (!communityId) {
      Logger.warn('Error fetching community - community slug not found', {
        slug,
        encodedSlug,
      });
      return null;
    }
    const community = await getCommunityById(communityId);
    const communityFormDatabase =
      await getCommunityByIdFromDatabase(communityId);
    let response = {};
    if (communityFormDatabase) {
      response = { ...communityFormDatabase };
    }
    if (community) {
      response = { ...response, ...community };
    }
    return response;
  } catch (error) {
    Logger.error('Error fetching community', { error });
  }
  return null;
}

async function getCommunityCourses(communityId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/courses/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
      data: { communityId, approvedOnly: true },
    };

    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to fetch community courses',
    });
    return { error };
  }
  return { error: 'Failed to fetch community courses' };
}

async function getCommunityEvents(communityId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/events/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
      data: { communityId },
    };

    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to fetch community events',
    });
    return { error };
  }
  return { error: 'Failed to fetch community events' };
}

export {
  isCommunityActive,
  getCommunityById,
  getCommunityByIdFromDatabase,
  getCommunityFromSlug,
  getCommunityCourses,
  getCommunityEvents,
  getCommunityLogo,
  getAllCommunityCoaches,
};
