const Axios = require('axios');
const config = require('../config');

function isSeriesActive(series) {
  if (!series) return false;
  const { approved, deletedAt } = series;
  if (approved && !deletedAt) {
    return true;
  }
  return false;
}

async function listSeries({ coachId }) {
  try {
    const options = {
      method: 'POST',
      url: `${config().api.auraServices}/series/list`,
      data: coachId ? { coachId } : {},
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_USER_WEB_TOKEN}`,
      },
      json: true,
    };
    const response = await Axios(options);
    if (response && response.data) {
      return response.data.filter(isSeriesActive);
    }
  } catch (error) {
    return { error };
  }
  return { error: 'Failed to fetch all series' };
}

export { listSeries };
