import Logger from '../../src/services/Logger';
import config from '../config';

const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');

let firebase;
try {
  firebase = initializeApp(config().firebase);
} catch (error) {
  // taken from https://github.com/now-examples/next-news/blob/master/lib/db.js
  if (!/already exists/.test(error.message)) {
    Logger.error('Firebase initialization error', { error });
  }
}
const Database = getDatabase(firebase);

const Firebase = {
  App: firebase,
  Database,
};

export default Firebase;
