import axios from 'axios';
import { notifyAPIError } from '@/services/ErrorMonitoring';
import Auth from '@/services/Auth';
import config from '@/config';
import FirebaseDatabase from '../services/FirebaseDatabase';
import Logger from '../services/Logger';

function isCourseActive(course) {
  if (!course) return false;
  const { approved } = course;
  return approved;
}

function isCourseFree(isUserSubscriber, isCoursePartOfCommunity, course) {
  return (
    (isUserSubscriber && isCoursePartOfCommunity && !course.communityPrice) ||
    (!isCoursePartOfCommunity && !course.price)
  );
}

function getCommunityMemberCourseDiscount(course) {
  if (!course.price) {
    return 0;
  }
  const discount = course.price - course.communityPrice;
  return discount / 100;
}

function getCommunityMemberCoursePrice(course) {
  return course.communityPrice / 100;
}

function getCourseTracksCount(course) {
  if (!course.sections || !Array.isArray(course.sections)) {
    return 0;
  }

  const trackCount = course.sections.reduce((count, section) => {
    return (
      count +
      section.content.filter((content) => content.type === 'track').length
    );
  }, 0);

  return trackCount;
}

async function getCourseById(courseId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/courses/${courseId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      if (isCourseActive(response.data)) {
        return response.data;
      }
      return null;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch course' });
    return { error };
  }
  return { error: 'Failed to fetch course' };
}

async function getAllCourseCoaches(courseId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/courses/coaches/list`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      data: { courseId },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch course coaches' });
    return { error };
  }
  return { error: 'Failed to fetch course coaches' };
}

async function getCourseFromSlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const courseId = await FirebaseDatabase.getValue(
      `/slugCourse/${encodedSlug}`
    );
    if (!courseId) {
      Logger.warn('Error fetching course - course slug not found', {
        slug,
        encodedSlug,
      });
      return null;
    }
    return await getCourseById(courseId);
  } catch (error) {
    Logger.error('Error fetching course', { error });
  }
  return null;
}

async function joinCourse(courseId) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/courses/users/${courseId}`,
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
    notifyAPIError(error, { message: 'Failed to join course' });
    return { error };
  }
  return { error: 'Failed to join course' };
}

export {
  isCourseActive,
  isCourseFree,
  getCourseById,
  getCourseFromSlug,
  getCommunityMemberCourseDiscount,
  getAllCourseCoaches,
  getCourseTracksCount,
  joinCourse,
  getCommunityMemberCoursePrice,
};
