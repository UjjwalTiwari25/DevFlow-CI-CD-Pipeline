import Axios from 'axios';
import config from '../config';
import Auth from '../services/Auth';
import FirebaseDatabase from '../services/FirebaseDatabase';
import { notifyAPIError } from '../services/ErrorMonitoring';

function isSeriesActive(series) {
  if (!series) return false;
  const { approved, deletedAt } = series;
  if (approved && !deletedAt) {
    return true;
  }
  return false;
}

async function listSeries({ coachId }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/series/list`,
      data: coachId ? { coachId } : {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data.filter(isSeriesActive);
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch all series' });
    return { error };
  }
  return { error: 'Failed to fetch all series' };
}

async function fetchSeries({ id }) {
  const authToken = await Auth.getUserAuthToken();
  try {
    const options = {
      method: 'GET',
      url: `${config.api.auraServices}/series/${id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      if (isSeriesActive(response.data)) {
        return response.data;
      }
    }
  } catch (error) {
    notifyAPIError(error, { message: 'Failed to fetch series' });
    return { error };
  }
  return { error: 'Failed to fetch series' };
}

async function getListenedSeriesTracks(id) {
  const res = await FirebaseDatabase.getValue(`/userSeries/${id}`);
  return res;
}

export { listSeries, fetchSeries, getListenedSeriesTracks };
