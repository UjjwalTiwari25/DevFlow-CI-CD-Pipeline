import FirebaseDatabase from '../services/FirebaseDatabase';
import Logger from '../services/Logger';

async function getExploreTopicHeaders() {
  const headers = [];
  try {
    const snapshot = await FirebaseDatabase.getSnapshot(`exploreHeaders`);
    if (snapshot.val()) {
      snapshot.forEach((snapItem) => {
        if (snapItem.val()) {
          headers.push({
            ...snapItem.val(),
            id: snapItem.key,
          });
        }
      });
      headers.sort((a, b) => {
        return a.sequence - b.sequence;
      });
    }
  } catch (err) {
    Logger.error('error fetching topic headers', { code: err.code });
  }
  return headers;
}

async function getTopics() {
  const topics = [];
  const snapshot = await FirebaseDatabase.getSnapshot(`topics`);
  if (snapshot.val()) {
    snapshot.forEach((snapItem) => {
      if (snapItem.val() && !snapItem.val().inactive) {
        topics.push({
          ...snapItem.val(),
          key: snapItem.key,
        });
      }
    });
  }
  topics.sort((a, b) => {
    const premiumA = a.premium ? 1 : 0;
    const premiumB = b.premium ? 1 : 0;
    return premiumA - premiumB;
  });
  return topics;
}

// @param: allowedTopicSlugs, get only these topic names eg: ["musicJazz", "musicCalm"]
async function getTopicsOfTrackType(trackTypeInternal, allowedTopicSlugs) {
  if (!trackTypeInternal) {
    Logger.warn(`Error: Missing parameters`);
    return [];
  }
  const allTopics = await getTopics();
  let trackType = trackTypeInternal;
  if (trackType === `meditation`) {
    trackType = `mindfulness`;
  }
  let topics = allTopics.filter((topic) => {
    let topicType = `mindfulness`;
    if (topic.type) {
      topicType = topic.type;
    }
    return trackType === topicType;
  });

  if (allowedTopicSlugs && allowedTopicSlugs.length > 0) {
    topics = topics.filter((topic) => {
      if (topic.topic && allowedTopicSlugs.includes(topic.topic)) {
        return true;
      }
      return false;
    });
  }
  return topics;
}

async function getTopicCategories() {
  let categories = null;
  try {
    const res = await FirebaseDatabase.getValue(`categories`);
    if (res) {
      categories = res;
    }
  } catch (err) {
    Logger.error('error fetching topic categories', { code: err.code });
  }
  return categories;
}

async function getTopicCategoryByKey(key) {
  let topic = null;
  try {
    const res = await FirebaseDatabase.getValue(`categories/${key}`);
    if (res) {
      topic = res;
    }
  } catch (err) {
    Logger.error('error fetching topic', { code: err.code });
  }
  return topic;
}

async function getCategoryIdFromSlug(slug) {
  let topic = null;
  try {
    const res = await FirebaseDatabase.getValue(`slugCategory/${slug}`);
    if (res) {
      topic = res;
    }
  } catch (err) {
    Logger.error('error fetching getCategoryIdFromSlug', { code: err.code });
  }
  return topic;
}

async function getSimilarTopics(topic) {
  if (!topic.groups || !topic.groups.length) {
    return null;
  }
  const { groups, key } = topic;
  const topicsCategories = await getTopicCategories();
  const similarTopics = [];
  groups.forEach((group) => {
    Object.values(topicsCategories).forEach((category) => {
      if (category.groups && category.key !== key) {
        const filteredItem = category.groups.find((item) => item === group);
        if (filteredItem) {
          similarTopics.push(category);
        }
      }
    });
  });
  return similarTopics;
}

const getTopicTitle = (topic) => {
  if (topic.buttonTitleChakra) {
    return topic.buttonTitleChakra;
  }
  return topic.title;
};

export {
  getTopics,
  getExploreTopicHeaders,
  getTopicsOfTrackType,
  getTopicCategories,
  getTopicCategoryByKey,
  getCategoryIdFromSlug,
  getSimilarTopics,
  getTopicTitle,
};
