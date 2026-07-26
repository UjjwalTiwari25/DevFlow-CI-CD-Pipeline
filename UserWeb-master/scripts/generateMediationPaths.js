const axios = require('axios');
const Logger = require('../src/services/Logger');
const routeConstants = require('../src/utils/constants/routes');

const meditationTracksCountRequest = {
  method: 'POST',
  headers: { 'Content-Type': `application/json` },
  url: 'https://services.aurahealth.io/contents/count',
  data: {
    useDayBucket: false,
  },
};

const meditationTracksRequest = {
  method: 'POST',
  headers: { 'Content-Type': `application/json` },
  url: 'https://services.aurahealth.io/contents/list',
  data: {
    useDayBucket: false,
  },
};

const musicTracksCountRequest = {
  method: 'POST',
  headers: { 'Content-Type': `application/json` },
  url: 'https://services.aurahealth.io/contents/count',
  data: {
    useDayBucket: false,
    type: 'music',
  },
};

const musicTracksRequest = {
  method: 'POST',
  headers: { 'Content-Type': `application/json` },
  url: 'https://services.aurahealth.io/contents/list',
  data: {
    useDayBucket: false,
    type: 'music',
  },
};

async function generateMeditationPaths() {
  const meditationCount = await axios(meditationTracksCountRequest).catch(
    (error) => {
      Logger.error('failed to fetch meditation count', { error });
      throw new Error('failed to fetch meditation count');
    }
  );
  Logger.info('meditations count', { meditationData: meditationCount.data });
  meditationTracksRequest.data.limit = meditationCount.data.count;
  const meditations = await axios(meditationTracksRequest).catch((error) => {
    Logger.error('failed to fetch meditation for sitemap', { error });
    throw new Error('failed to fetch meditation');
  });
  Logger.info('meditations received', { count: meditations.data.length });
  const musicTracksCount = await axios(musicTracksCountRequest).catch(
    (error) => {
      Logger.error('failed to fetch music tracks count', { error });
      throw new Error('failed to fetch music tracks count');
    }
  );
  Logger.info('music tracks count', { musicTrackCount: musicTracksCount.data });
  musicTracksRequest.data.limit = meditationCount.data.count;
  const musicTracks = await axios(musicTracksRequest).catch((error) => {
    Logger.error('failed to fetch music tracks for sitemap', { error });
    throw new Error('failed to fetch music tracks');
  });
  Logger.info('music tracks received', { count: musicTracks.data.length });
  const paths = [];
  meditations.data.forEach((meditation) => {
    const { slug } = meditation;
    paths.push({ params: { [routeConstants.SLUG_MEDITATION]: slug } });
  });
  musicTracks.data.forEach((meditation) => {
    const { slug } = meditation;
    paths.push({ params: { [routeConstants.SLUG_MEDITATION]: slug } });
  });
  Logger.info('generated meditation paths', { count: paths.length });
  return paths;
}

module.exports = generateMeditationPaths;
