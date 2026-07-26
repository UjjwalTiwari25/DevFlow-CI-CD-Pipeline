/**
 * @module serverConfig
 * @description Service for the server configuration
 * @copyright Aura Health, Inc.
 */

// Store the configuration
function config() {
  return {
    environment: process.env.NODE_ENV,
    mode: process.env.NEXT_PUBLIC_MODE,
    appDomain: process.env.NEXT_PUBLIC_APP_DOMAIN,
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
    api: {
      auraServices: process.env.NEXT_PUBLIC_AURA_SERVICES_URL,
    },
  };
}

module.exports = config;
