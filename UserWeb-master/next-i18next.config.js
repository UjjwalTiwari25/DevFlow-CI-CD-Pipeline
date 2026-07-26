/** @type {import('next-i18next').UserConfig} */
const LOCALES = require('./src/data/locales.json');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales:
      process.env.NEXT_PUBLIC_MODE === 'DEV'
        ? Object.values(LOCALES).map((locale) => locale.urlPathId)
        : Object.values(LOCALES)
            .filter((locale) => locale.enabled)
            .map((locale) => locale.urlPathId),
  },
  ns: [
    'common',
    'signup',
    'getapp',
    'upsell',
    'subscribe',
    'yourplan',
    'guestpass',
    'trackReferral',
    'liveReferral',
    'guestPassReferral',
    'videoCoaching',
    'playlistReferral',
    'challengeReferral',
    'refer',
    'course',
    'event',
    'community',
  ],
  fallbackLng: 'en',
  fallbackNS: 'common',
  localeDetection: false,
};
