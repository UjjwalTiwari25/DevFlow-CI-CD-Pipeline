import Axios from 'axios';
import config from '../config';
import { notifyAPIError, notifyHandledError } from './ErrorMonitoring';

async function fetchFirebaseData(key) {
  try {
    const options = {
      method: 'GET',
      url: `${config.cdn.firebase}/${key}.json`,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    if (!response || !response.data) {
      notifyHandledError(null, {
        message: 'No data received from CDN for Firebase key',
        key,
      });
    }
    return response.data;
  } catch (error) {
    notifyAPIError(error, {
      message: 'Error fetching data from CDN for Firebase',
    });
    return null;
  }
}

const AuraCDN = {
  fetchFirebaseData,
};

export default AuraCDN;
