const { default: axios } = require('axios');
const config = require('../config');

async function getCourse({ courseId }) {
  try {
    const options = {
      method: 'GET',
      url: `${config().api.auraServices}/courses/${courseId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    return { error };
  }
  return { error: 'Failed to fetch course' };
}

async function getEvent({ eventId }) {
  try {
    const options = {
      method: 'GET',
      url: `${config().api.auraServices}/events/${eventId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    return { error };
  }
  return { error: 'Failed to fetch event' };
}

async function getCommunity({ communityId }) {
  try {
    const options = {
      method: 'GET',
      url: `${config().api.auraServices}/communities/${communityId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    return { error };
  }
  return { error: 'Failed to fetch community' };
}

async function getCoach({ coachId }) {
  try {
    const options = {
      method: 'GET',
      url: `${config().api.auraServices}/coaches/${coachId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    return { error };
  }
  return { error: 'Failed to fetch all series' };
}

module.exports = { getCoach, getCourse, getEvent, getCommunity };
