/**
 * @module config
 * @description Service for the application configuration
 * @copyright Aura Health, Inc.
 */

// Internal dependencies
const { name, version } = require('../package.json');

// Store the configuration
const config = {
  environment: process.env.NODE_ENV,
  mode: process.env.NEXT_PUBLIC_MODE,
  appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN,
  appDomainProd: 'https://aurahealth.io',
  cdn: {
    firebase:
      process.env.NEXT_PUBLIC_CDN_FIREBASE_URL ||
      'https://firebase.cdn.aurahealth.io',
  },
  firebase: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  },
  googleOAuth: {
    calendarClientId: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_AUTH_CLIENT_ID,
  },
  logger: {
    level: process.env.NEXT_PUBLIC_LOGGER_LEVEL || 'info',
    useJSON: !(process.env.NEXT_PUBLIC_LOGGER_USE_JSON === 'false'),
  },
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
  },
  service: {
    name,
    version,
  },
  clientInfo: {
    appVersion: version,
    appIdentifier: 'io.aurahealth.user',
    platform: 'UserWeb',
  },
  bugsnag: {
    apiKey: process.env.NEXT_PUBLIC_BUGSNAG_KEY,
    releaseStage: process.env.NEXT_PUBLIC_MODE,
    appVersion: version,
  },
  api: {
    baseUrl: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/api`,
    auraServices: `${process.env.NEXT_PUBLIC_APP_DOMAIN}/auraServices`,
    auraWeb: process.env.NEXT_PUBLIC_AURA_WEB_URL,
  },
  cache: {
    // Server-side TTL (seconds) for the SSR coaches list cache.
    coachesListTTL: process.env.COACHES_LIST_CACHE_TTL
      ? parseInt(process.env.COACHES_LIST_CACHE_TTL, 10)
      : 120,
  },
  stripe: {
    stripeKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
  },
  branch: {
    branchKey: process.env.NEXT_PUBLIC_BRANCH_KEY,
  },
  clarity: {
    id: process.env.NEXT_PUBLIC_CLARITY_APP_ID,
  },
  tiktok: {
    pixel: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
  },
  pixel: {
    web: process.env.NEXT_PUBLIC_PIXEL_ID,
    webAndroid: process.env.NEXT_PUBLIC_PIXEL_ANDROID_ID,
    webIos: process.env.NEXT_PUBLIC_PIXEL_IOS_ID,
  },
  geolocationDbKey: process.env.NEXT_PUBLIC_GEOLOCATION_DB_KEY,
  googleTagManagerId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
  aiDesktop: {
    yamlUrl: process.env.NEXT_PUBLIC_DESKTOP_YAML_URL,
    releasesBaseUrl: process.env.NEXT_PUBLIC_DESKTOP_RELEASES_BASE_URL,
  },
};

module.exports = config;
