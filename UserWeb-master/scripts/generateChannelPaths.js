const axios = require('axios');
const Logger = require('../src/services/Logger');
const routeConstants = require('../src/utils/constants/routes');
const CHANNEL_TOPICS_SLUG_KEYS = require('../src/data/pageContent/channelsSlugKeyMappings.json');

const channelListRequest = {
  method: 'GET',
  headers: { 'Content-Type': `application/json` },
  url: 'https://auratech16.firebaseio.com/slugChannel.json',
};

async function generateChannelPaths() {
  const response = await axios(channelListRequest).catch((error) => {
    Logger.error('failed to fetch channels list', { error });
    throw new Error('error fetching channels list');
  });
  const channelList = response.data;
  Logger.info('channels list received', {
    count: Object.keys(channelList).length,
  });

  const paths = [];
  Object.keys(channelList).forEach((slugChannel) => {
    paths.push({ params: { [routeConstants.SLUG_CHANNEL]: slugChannel } });
  });
  Object.keys(CHANNEL_TOPICS_SLUG_KEYS).forEach((channelSlugKey) => {
    paths.push({ params: { [routeConstants.SLUG_CHANNEL]: channelSlugKey } });
  });

  Logger.info('generated channel paths', {
    count: paths.length,
  });
  return paths;
}

module.exports = generateChannelPaths;
