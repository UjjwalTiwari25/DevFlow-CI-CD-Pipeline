const axios = require('axios');
const Logger = require('../src/services/Logger');
const routeConstants = require('../src/utils/constants/routes');

const coachListRequest = {
  method: 'GET',
  headers: { 'Content-Type': `application/json` },
  url: 'https://auratech16.firebaseio.com/coaches.json',
};

async function generateCoachesPaths() {
  const response = await axios(coachListRequest).catch((error) => {
    Logger.error('failed to fetch coaches list', { error });
    throw new Error('failed to fetch coaches list');
  });
  const coachesList = response.data;
  Logger.info('coaches list received', {
    count: Object.keys(coachesList).length,
  });

  function isCoachActive(coach) {
    if (!coach) return false;
    const { approved, bookable, deleted, videoCoachingApproved } = coach;
    return (approved || bookable || videoCoachingApproved) && !deleted;
  }

  const coaches = Object.keys(coachesList).map((coach) => {
    return {
      id: coach,
      ...coachesList[coach],
    };
  });

  let filteredCoaches = coaches;
  // The filtered coaches contain all the coaches that have been approved
  filteredCoaches = coaches.map(async (coach) => {
    if (!isCoachActive(coach)) {
      return null;
    }
    return coach;
  });
  filteredCoaches = await Promise.all(filteredCoaches);

  filteredCoaches = filteredCoaches.filter((x) => {
    return !!x && !!x.name;
  });

  filteredCoaches.sort((a, b) => {
    if (!b.followersCount) return -1;
    return b.followersCount - a.followersCount;
  });

  const paths = [];
  filteredCoaches.forEach((coach) => {
    const { slug } = coach;
    paths.push({ params: { [routeConstants.SLUG_COACH]: slug } });
    if (coach.tracks) {
      paths.push({
        params: { [routeConstants.SLUG_COACH]: `${coach.slug}/tracks` },
      });
    }
    if (coach.channels) {
      paths.push({
        params: { [routeConstants.SLUG_COACH]: `${coach.slug}/channels` },
      });
    }
  });

  Logger.info('generated coaches paths', {
    count: paths.length,
  });
  return paths;
}

module.exports = generateCoachesPaths;
