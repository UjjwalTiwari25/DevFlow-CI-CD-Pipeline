import Axios from 'axios';
import Logger from './Logger';
import config from '../config';
import { notifyAPIError } from './ErrorMonitoring';

async function getUserGeoLocation() {
  let userLocation = {};
  try {
    const response = await Axios.get(`https://api.country.is`, {
      timeout: 3000,
    });
    if (response && response.data) {
      userLocation = {
        countryCode: response.data.country,
      };
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch location' });
  }
  Logger.debug('Geo Location', { userLocation });
  return userLocation;
}

async function getUserIPAddress() {
  let ipAddress = null;
  try {
    const response = await Axios.get(`${config.api.baseUrl}/ip`, {
      timeout: 2000,
    });
    if (response.data && response.data.ip) {
      ipAddress = response.data.ip;
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch ip address' });
  }
  Logger.debug('IP Address', { ipAddress });
  return ipAddress || null;
}

const IPLookup = {
  getUserGeoLocation,
  getUserIPAddress,
};

export default IPLookup;
