const contentConstants = require('./constants/community');

const getTypeTitle = (type) => {
  if (type === contentConstants.COMMUNITY_FEATURE_TYPES.EVENT)
    return 'text_event';
  if (type === contentConstants.COMMUNITY_FEATURE_TYPES.COURSE)
    return 'text_course';
  return 'text_event';
};

module.exports = { getTypeTitle };
