/* eslint-disable no-await-in-loop */
import axios from 'axios';
import Logger from './Logger';

/**
 * @method handle
 * @param {Object} options
 * @returns {Object} response data
 * @description handle the request
 * @async
 */
async function handle(options) {
  const { url } = options;
  const meta = {
    component: 'httpConnector',
    method: 'handle',
    url,
  };
  const request = options;
  Logger.debug(`Handling request`, { ...meta, request });
  const response = await axios({ ...request, withCredentials: true });
  Logger.debug(`Received a response for the HTTP call`, meta);
  return response;
}

async function pollApi(
  url,
  {
    maxAttempts = 5,
    initialInterval = 4000,
    finalInterval = 2000,
    headers = {},
  } = {}
) {
  let interval = initialInterval;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    Logger.debug(`Attempt ${attempt}: Polling API...`);

    try {
      const response = await axios(url, { headers });
      if (response && response.status === 200) {
        return response.data || { success: true };
      }
      throw new Error('API request failed.');
    } catch (error) {
      Logger.debug(error.message);
      if (attempt < maxAttempts) {
        Logger.debug(`Retrying in ${interval / 1000} seconds...`);
        const currentInterval = interval;
        await new Promise((resolve) => {
          setTimeout(resolve, currentInterval);
        });
        interval = Math.max(finalInterval, interval / 2); // Decrease interval
      } else {
        Logger.warn('Max attempts reached. Exiting...');
        return null;
      }
    }
  }
  return null;
}

const Http = { handle, pollApi };

export default Http;
