import axios from 'axios';
import { notifyAPIError } from '@/services/ErrorMonitoring';
import Auth from '@/services/Auth';
import config from '@/config';
import FirebaseDatabase from '../services/FirebaseDatabase';
import Logger from '../services/Logger';

function isEventActive(event) {
  if (!event) return false;
  const { approved } = event;
  return approved;
}

function isEventFromPast(event) {
  const eventDate = new Date(event.scheduledAt);
  const currentDate = new Date();

  return eventDate < currentDate;
}

function getCommunityMemberEventDiscount(event) {
  if (!event.price) {
    return 0;
  }
  const discount = event.price - event.communityPrice;
  return discount / 100;
}

function getCommunityMemberEventPrice(event) {
  return event.communityPrice / 100;
}

function isEventFree({
  isEventPartOfCommunity,
  isUserSubscriber,
  isExclusiveToCommunity,
  event,
}) {
  return (
    (isUserSubscriber && isEventPartOfCommunity && !event.communityPrice) ||
    (isEventPartOfCommunity &&
      !isUserSubscriber &&
      !isExclusiveToCommunity &&
      !event.price) ||
    (!isEventPartOfCommunity && !event.price)
  );
}

async function getAllEventCoaches(eventId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/events/coaches/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      data: { eventId },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch event coaches' });
    return { error };
  }
  return { error: 'Failed to fetch event coaches' };
}

async function getEventById(eventId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/events/${eventId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch event' });
    return { error };
  }
  return { error: 'Failed to fetch event' };
}

async function getEventFromSlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const eventId = await FirebaseDatabase.getValue(
      `/slugEvent/${encodedSlug}`
    );

    if (!eventId) {
      Logger.warn('Error fetching event - event slug not found', {
        slug,
        encodedSlug,
      });
      return null;
    }
    return await getEventById(eventId);
  } catch (error) {
    Logger.error('Error fetching event', { error });
  }
  return null;
}

async function getEventAttendingMembers(eventId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/events/users/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
      data: { eventId },
    };

    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to fetch event attending members',
    });
    return { error };
  }
  return { error: 'Failed to fetch event attending members' };
}

async function bookEvent(eventId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/events/users/${eventId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      data: { transactionAmount: 0 },
    };
    const response = await axios(options);

    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to book event' });
    return { error };
  }
  return { error: 'Failed to book event' };
}

export {
  isEventActive,
  isEventFree,
  isEventFromPast,
  getEventById,
  getEventFromSlug,
  getEventAttendingMembers,
  getCommunityMemberEventDiscount,
  getCommunityMemberEventPrice,
  getAllEventCoaches,
  bookEvent,
};
