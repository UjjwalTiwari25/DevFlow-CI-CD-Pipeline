import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const config = require('../config');
const Logger = require('./Logger');

let firebase;
let database;
let auth;
let storage;
try {
  if (!firebase) {
    try {
      firebase = initializeApp(config.firebase);
      database = getDatabase(firebase);
      auth = getAuth(firebase);
      storage =
        typeof window !== 'undefined' && typeof storage === 'undefined' // eslint-disable-line no-use-before-define
          ? getStorage(firebase)
          : undefined;
    } catch (error) {
      const { code } = error || {};
      if (code === 'messaging/unsupported-browser') {
        Logger.info('Browser does not support Firebase push', { error });
      } else {
        Logger.warn('Error initializing Firebase', { error });
      }
    }
  }
} catch (err) {
  // taken from https://github.com/now-examples/next-news/blob/master/lib/db.js
  if (!/already exists/.test(err.message)) {
    Logger.error('Firebase initialization error', err);
  }
}

const Firebase = {
  App: firebase,
  Auth: auth,
  Database: database,
  Storage: storage,
};

export default Firebase;
