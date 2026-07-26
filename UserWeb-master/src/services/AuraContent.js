import axios from 'axios';
import shuffleArray from 'shuffle-array';
import config from '@/config';
import contentConstants from '../utils/constants/content';
import Logger from './Logger';
import Auth from './Auth';
import { listChannels, filterChannels } from '../models/channel';
import { getExploreTopicHeaders, getTopicCategories } from '../models/topic';
import { filterActiveTracks } from '../models/meditation';
import { notifyAPIError } from './ErrorMonitoring';

async function getTracks({
  topic = null,
  contentType = 'all',
  durationFilter = contentConstants.DURATION_KEYS.ALL,
  authorName,
  author,
  enrich = true,
  useDayBucket = false,
  channels = [],
  category = null, // Defaults to popular
  topicCategory = null, // optional as defined in firebase categories node
  routeSuffix = null,
  limit = 10, // Configures the number of tracks returned from api.
  anyTags = null, // Optional search tags, contains at least one of them, example ['sleep', 'anxiety']
  durations = null, // Optional array of duration. If specified overrides the duration
  emotion,
  excludeTrackIds = [],
  tags = null, // Optional search tags, contains all of them, example ['sleep', 'bedtime']
  shuffle = false, // Specify if tracks are to be shuffled after fetch
  locale = null, // Optional locale - if passed only tracks in this locale will be fetched - overrides user locale preference
  anyLocales = null, // Optional array of locales - only tracks in these locales will be fetched
  preferredLocale = null, // Optional preferred locale - prioritize particular locale if tracks from multiple locales are being fetched
  sinceDays,
  useOnlyPopular = false,
  user = null, // Optional user data - can be used to provide user info eg locale if user is not logged in
}) {
  let duration = contentConstants.DURATION_KEYS_FOR_REQUEST[durationFilter];
  let multipleDurations = null;
  if (durations && durations.length) {
    multipleDurations = durations.map(
      (filter) => contentConstants.DURATION_KEYS_FOR_REQUEST[filter]
    );
    duration = null;
  }
  let type = contentType;
  if (contentType === 'meditation') {
    type = 'mindfulness';
  }
  const userData = { ...user };
  if (preferredLocale) {
    userData.locale = preferredLocale;
  }
  const options = {
    type,
    excludeTrackIds,
    authorName,
    emotion,
    duration,
    topic,
    useDayBucket,
    tags,
    enrich,
    channels,
    author,
    limit,
    anyTags,
    durations: multipleDurations,
    category: topicCategory,
    locale,
    sinceDays,
    useOnlyPopular,
    anyLocales,
  };
  let apiRoute = `contents/recommend`;
  const customRoutes = {
    [contentConstants.CONTENT_CATEGORY.SEARCH]: `contents/search`,
    [contentConstants.CONTENT_CATEGORY.RECOMMEND]: `contents/recommend`,
    [contentConstants.CONTENT_CATEGORY.SERIES]: `contents/series`,
  };
  if (category && customRoutes[category]) {
    apiRoute = customRoutes[category];
  }
  if (routeSuffix) {
    apiRoute = routeSuffix;
  }
  const token = await Auth.getUserAuthToken();
  if (!token) {
    options.useDayBucket = false;
    options.user = userData;
  }
  Logger.debug('Fetching tracks', { apiRoute, options, token });
  let tracks = await fetchTracks(apiRoute, options, token);
  tracks = await filterActiveTracks(tracks);

  if (!tracks || tracks.error) {
    Logger.warn('Error fetching tracks', { tracks });
  }
  if (shuffle && Array.isArray(tracks)) {
    return shuffleArray(tracks);
  }
  return tracks;
}

async function fetchTracks(route, options = {}, token = null) {
  if (!route || route === '') {
    Logger.warn('No route specified');
    return null;
  }
  const url = `${config.api.auraServices}/${route}`;
  const headers = {
    Accept: `application/json`,
    'Content-Type': `application/json`,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  try {
    const res = await axios({
      method: `post`,
      url,
      timeout: 11000,
      headers,
      data: options,
    });
    let json = res.data;
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        return { error: e };
      }
    }
    const isMultiple = options.limit >= 1;
    if (Array.isArray(json) && !isMultiple) {
      [json] = json;
    }
    if (isMultiple && Array.isArray(json) && !options.enrich) {
      return json.map((x) => x.id);
    }
    return json;
  } catch (error) {
    notifyAPIError(error, { message: 'Error fetching tracks', options, route });
    return { error };
  }
}

async function fetchPageData(dataRows) {
  Logger.debug('Generating page rows content', { dataRows });
  const pageContent = {};
  const dataPromises = [];
  const channels = await listChannels();
  Object.values(dataRows).forEach((dataRow) => {
    switch (dataRow.contentType) {
      case contentConstants.CONTENT_UI_TYPES.TRACKS:
        dataPromises.push(getTracks(dataRow.query));
        break;
      case contentConstants.CONTENT_UI_TYPES.CHANNELS:
        dataPromises.push(
          filterChannels({
            channels,
            query: dataRow.query,
          })
        );
        break;
      default:
        dataPromises.push(null);
        break;
    }
  });
  const dataValues = await Promise.all(dataPromises);
  Object.keys(dataRows).forEach((key, index) => {
    const tracks = dataValues[index];
    if (!tracks || tracks.error) {
      return;
    }
    pageContent[key] = tracks;
  });
  return {
    pageContent,
  };
}

async function fetchExploreTopicsData() {
  const headers = await getExploreTopicHeaders();
  const topicsCategories = await getTopicCategories();
  return headers.map((header) => {
    const headerData = header;
    headerData.label = header.title;
    const headerId = header.id;
    Object.values(topicsCategories).forEach((category) => {
      if (category.groups) {
        const filteredItem = category.groups.find((item) => item === headerId);
        if (filteredItem) {
          if (!headerData.data) {
            headerData.data = [category];
          } else {
            headerData.data.push(category);
          }
        }
      }
    });
    return headerData;
  });
}

async function coachesList(anyTopics) {
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/coaches/recommend`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      data: {
        anyTopics,
        enrich: true,
        limit: 15,
      },
    };
    const response = await axios(options);
    if (response && response.data) {
      return response.data;
    }
  } catch (error) {
    notifyAPIError(error, {
      message: 'Failed to fetch recommended coach list',
    });
    return null;
  }
  return null;
}

async function listAllTracks(topics) {
  if (topics && topics.includes('sleepAnxiety')) {
    topics.splice(topics.indexOf('sleepAnxiety'), 1, 'anxiety');
  }
  if (topics && topics.includes('boostEnergy')) {
    topics.splice(topics.indexOf('boostEnergy'), 1, 'energy');
  }
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/contents/count`,
      headers: { 'Content-Type': `application/json` },
      data: {
        anyTopics: topics,
        useDayBucket: false,
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data && response.data.count) {
      return response;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch track count' });
    return { error };
  }
  return { error: 'Failed to fetch track count' };
}

async function listAllCoaches(topics, limit) {
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/coaches/list`,
      headers: { 'Content-Type': `application/json` },
      data: {
        anyTopics: topics,
        limit: limit || '',
      },
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      const { data } = response;
      return data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch coaches list' });
    return { error };
  }
  return { error: 'Failed to fetch coaches list' };
}

async function getCategories(filters) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/categories/recommend`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: filters || {},
      json: true,
    };
    const response = await axios(options);
    if (response && response.data) {
      const { data } = response;
      return data;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch categories list' });
    return { error };
  }
  return { error: 'Failed to fetch categories list' };
}

async function getMultipleTrackQueries(userId, options = {}) {
  const authToken = await Auth.getUserAuthToken();
  let data = {};
  Object.values(options).forEach((option) => {
    const {
      topic = null,
      contentType = 'all',
      durationFilter = contentConstants.DURATION_KEYS.ALL,
      authorName,
      author,
      enrich = true,
      useDayBucket = false,
      channels = [],
      topicCategory = null, // optional as defined in firebase categories node
      limit = 10, // Configures the number of tracks returned from api.
      anyTags = null, // Optional search tags, contains at least one of them, example ['sleep', 'anxiety']
      durations = null, // Optional array of duration. If specified overrides the duration
      emotion,
      excludeTrackIds = [],
      tags = null, // Optional search tags, contains all of them, example ['sleep', 'bedtime']
    } = option;
    let duration = contentConstants.DURATION_KEYS_FOR_REQUEST[durationFilter];
    let multipleDurations = null;
    if (durations && durations.length) {
      multipleDurations = durations.map(
        (filter) => contentConstants.DURATION_KEYS_FOR_REQUEST[filter]
      );
      duration = null;
    }
    let type = contentType;
    if (contentType === 'meditation') {
      type = 'mindfulness';
    }
    const queryKey = topicCategory;
    const queryOptions = {
      type,
      excludeTrackIds,
      authorName,
      emotion,
      duration,
      topic,
      useDayBucket,
      tags,
      enrich,
      channels,
      author,
      limit,
      anyTags,
      durations: multipleDurations,
      category: topicCategory,
    };
    if (queryKey) {
      data = { ...data, [queryKey]: { ...queryOptions } };
    } else {
      data = { ...data, popular: { ...queryOptions } };
    }
  });
  if (!userId) {
    Logger.warn('No User ID Found');
    return null;
  }
  const url = `${process.env.NEXT_PUBLIC_AURA_SERVICES_URL}/contents/multiPopular`;
  const headers = {
    Accept: `application/json`,
    'Content-Type': `application/json`,
    Authorization: `Bearer ${authToken}`,
  };
  try {
    const res = await axios({
      method: `post`,
      url,
      timeout: 30000,
      headers,
      data,
    });
    let json = res.data;
    if (typeof json === 'string') {
      try {
        json = JSON.parse(json);
      } catch (e) {
        return { error: e };
      }
    }
    const isMultiple = options.limit >= 1;
    if (Array.isArray(json) && !isMultiple) {
      [json] = json;
    }
    if (isMultiple && Array.isArray(json) && !options.enrich) {
      return json.map((x) => x.id);
    }
    return json;
  } catch (error) {
    notifyAPIError(error, { message: 'Error getting tracks' });
    return { error };
  }
}

const AuraContent = {
  getTracks,
  fetchPageData,
  fetchExploreTopicsData,
  coachesList,
  listAllTracks,
  listAllCoaches,
  getCategories,
  fetchTracks,
  getMultipleTrackQueries,
};

export default AuraContent;
