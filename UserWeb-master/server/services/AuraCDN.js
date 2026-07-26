const axios = require('axios');
const Logger = require('../../src/services/Logger');
const cacheService = require('./Cache');
const config = require('../config');

const CACHE_PREFIX = 'auraCdnService';
const CACHE_TTL = 3600 * 12; // 12 hours

async function fetchFirebaseData(key) {
  const cacheKey = `${CACHE_PREFIX}/fetchFirebaseData/${key}`;

  // Try to get from cache first
  const cachedData = cacheService.get(cacheKey);
  if (cachedData) {
    Logger.info(`Cache hit for fetchFirebaseData: ${key}`);
    return cachedData;
  }

  try {
    const options = {
      method: 'GET',
      url: `${config().cdn.firebase}/${key}.json`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios(options);
    if (!response || !response.data) {
      Logger.warn(`No data received from CDN for Firebase key: ${key}`);
      return null;
    }

    // Store in cache
    cacheService.set(cacheKey, response.data, CACHE_TTL);
    return response.data;
  } catch (error) {
    Logger.error(
      `Error fetching data from CDN for Firebase: ${key} - ${error}`
    );
    return null;
  }
}

const AuraCDN = {
  fetchFirebaseData,
};

module.exports = AuraCDN;
