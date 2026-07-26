import axios from 'axios';
import config from '../config';

export function setupAxios() {
  axios.interceptors.request.use((axiosConfig) => {
    const { appVersion, appIdentifier, platform } = config.clientInfo;
    return {
      ...axiosConfig,
      headers: {
        ...axiosConfig.headers,
        'X-App-Identifier': appIdentifier,
        'X-App-Version': appVersion,
        'X-Platform': platform,
      },
    };
  });
}
