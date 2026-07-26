const axios = require('axios');
const Logger = require('../../src/services/Logger');
const urlFormater = require('../../src/utils/urlFormater');
const writeFile = require('../writeFile');

const channelListRequest = {
  method: 'GET',
  headers: { 'Content-Type': `application/json` },
  url: 'https://auratech16.firebaseio.com/channels.json',
};

async function slugChannelRedirects() {
  const response = await axios(channelListRequest).catch((error) => {
    Logger.error('failed to fetch channel list for redirects', { error });
    throw new Error('failed to fetch channel list');
  });
  const channelList = response.data;
  const redirectPathsObj = {};
  Object.keys(channelList).forEach((channelId) => {
    const channel = channelList[channelId];

    const channelURLWithId = urlFormater.generateURLPathWithID(
      `${channel.channelName}-${channel.authorName}`,
      channelId
    );
    redirectPathsObj[`/channels/${channelURLWithId}`] =
      `/channels/${channel.slug}`;
  });
  await writeFile(
    'server/redirects/channels-slugChannel.json',
    JSON.stringify(redirectPathsObj)
  );
}

module.exports = slugChannelRedirects;
slugChannelRedirects();
