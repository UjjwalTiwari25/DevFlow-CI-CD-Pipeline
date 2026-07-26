const axios = require('axios');
const Logger = require('../../src/services/Logger');
const urlFormater = require('../../src/utils/urlFormater');
const writeFile = require('../writeFile');

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

async function slugTrackRedirects() {
  const meditationCount = await axios(meditationTracksCountRequest).catch(
    (error) => {
      Logger.error('failed to fetch meditation count', { error });
      throw new Error('failed to fetch meditation count');
    }
  );
  Logger.info('meditations count', meditationCount.data);
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
  Logger.info('music tracks count', musicTracksCount.data);
  musicTracksRequest.data.limit = meditationCount.data.count;
  const musicTracks = await axios(musicTracksRequest).catch((error) => {
    Logger.error('failed to fetch music tracks for sitemap', { error });
    throw new Error('failed to fetch music tracks');
  });
  Logger.info('music tracks received', { count: musicTracks.data.length });
  const meditationPathRedirects = {};
  const trackIDPathRedirects = {};
  const trackSlugPathRedirects = {};
  meditations.data.forEach((meditation) => {
    const { slug } = meditation;
    const meditationURLWithNameAndId = urlFormater.generateURLPathWithID(
      meditation.title,
      meditation.id
    );
    const meditationURLOldId = `${meditation.title}$${meditation.id}`.replace(
      /[^a-zA-Z0-9-_$]/g,
      ''
    );
    meditationPathRedirects[`/meditation/${meditationURLOldId}`] =
      `/track/${slug}`;
    trackIDPathRedirects[`/track/${meditationURLOldId}`] = `/track/${slug}`;
    trackSlugPathRedirects[`/track/${meditationURLWithNameAndId}`] =
      `/track/${slug}`;
  });
  musicTracks.data.forEach((meditation) => {
    const { slug } = meditation;
    const meditationURLWithNameAndId = urlFormater.generateURLPathWithID(
      meditation.title,
      meditation.id
    );
    const meditationURLOldId = `${meditation.title}$${meditation.id}`.replace(
      /[^a-zA-Z0-9-_$]/g,
      ''
    );
    meditationPathRedirects[`/meditation/${meditationURLOldId}`] =
      `/track/${slug}`;
    trackIDPathRedirects[`/track/${meditationURLOldId}`] = `/track/${slug}`;
    trackSlugPathRedirects[`/track/${meditationURLWithNameAndId}`] =
      `/track/${slug}`;
  });
  await writeFile(
    'server/redirects/meditation-id.json',
    JSON.stringify(meditationPathRedirects, null, '\t')
  );
  await writeFile(
    'server/redirects/track-id.json',
    JSON.stringify(trackIDPathRedirects, null, '\t')
  );
  await writeFile(
    'server/redirects/track-slugMeditation.json',
    JSON.stringify(trackSlugPathRedirects, null, '\t')
  );
}

module.exports = slugTrackRedirects;
slugTrackRedirects();
