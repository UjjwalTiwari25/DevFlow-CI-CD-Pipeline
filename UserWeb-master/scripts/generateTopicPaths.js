const axios = require('axios');
const Logger = require('../src/services/Logger');
const routeConstants = require('../src/utils/constants/routes');
const TOPIC_DATA_ROWS = require('../src/data/pageContent/topicPageRows.json');

const topicListRequest = {
  method: 'GET',
  headers: { 'Content-Type': `application/json` },
  url: 'https://auratech16.firebaseio.com/categories.json',
};

async function generateTopicPaths() {
  const response = await axios(topicListRequest).catch((error) => {
    Logger.error('failed to fetch topics list', { error });
    throw new Error('error fetching topics list');
  });
  const topicList = response.data;
  Logger.info('topic list received', {
    count: Object.values(topicList).length,
  });

  const paths = [];
  Object.values(topicList).forEach((topic) => {
    const { slug } = topic;
    if (slug) {
      paths.push({ params: { [routeConstants.SLUG_CATEGORY]: slug } });
      Object.values(TOPIC_DATA_ROWS).forEach((topicData) => {
        if (topicData.viewAllPage) {
          paths.push({
            params: {
              [routeConstants.SLUG_CATEGORY]: `${topic.slug}/${topicData.viewAllPage}`,
            },
          });
        }
      });
    }
  });
  Logger.info('generated topic paths', {
    count: paths.length,
  });
  return paths;
}

module.exports = generateTopicPaths;
