const contentConstants = Object.freeze({
  DURATION_KEYS: {
    SHORT: 0,
    MEDIUM: 1,
    LONG: 2,
    LONGEST: 3,
    ALL: 4,
  },

  DURATION_KEYS_FOR_REQUEST: {
    0: `0-5`,
    1: `5-10`,
    2: `10-20`,
    3: `20+`,
    4: `all`,
  },

  DURATION_KEYS_FOR_DISPLAY: {
    0: `3 min`,
    1: `7 min`,
    2: `10 - 20`,
    3: `20+ min`,
    4: `All`,
  },

  CONTENT_CATEGORY: {
    RECOMMEND: 'recommend',
    NEW: 'new',
    POPULAR: 'popular',
    SERIES: 'series',
  },

  CONTENT_TYPES: {
    STORY: 'story',
    MEDITATION: 'meditation',
    MINDFULNESS: 'mindfulness',
    LIFE_COACHING: 'lifeCoaching',
    THERAPY: 'therapy',
    MUSIC: 'music',
    HYPNOSIS: 'hypnosis',
  },

  CONTENT_UI_TYPES: {
    TRACKS: 'tracks',
    TOPICS: 'topics',
    CHANNELS: 'channels',
    EXPLORE_AURA: 'exploreAura',
    CONTENT_TYPE: 'contentType',
  },
});

export default contentConstants;
