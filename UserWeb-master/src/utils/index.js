const { isToday, isTomorrow, format } = require('date-fns');
const HRNumbers = require('human-readable-numbers');
const crypto = require('crypto');
const config = require('../config');
const appConstants = require('./constants/app');
const MOBILE_ROW_QUERIES = require('../data/mobileRowQuery.json');

const isClient = () => {
  return typeof window === 'object';
};

function isProdMode() {
  return config.mode === appConstants.MODE_PRODUCTION;
}

function isTestMode() {
  return config.mode === appConstants.MODE_TEST;
}

function getCookie(cname) {
  const name = `${cname}=`;
  if (typeof document === 'undefined') {
    return null;
  }
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

function generateQueryPath(pathname, query) {
  const path = `/${pathname}`;
  if (!query || typeof query !== 'object') {
    return path;
  }
  const queryParams = new URLSearchParams();
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParams.set(key, value);
    }
  });
  const queryString = queryParams.toString();
  if (queryString && queryString.length) {
    return `${path}?${queryParams.toString()}`;
  }
  return path;
}

function generateExternalUrlQueryPath(pathname, query) {
  const path = `${pathname}`;
  if (!query || typeof query !== 'object') {
    return path;
  }
  const queryParams = new URLSearchParams();
  Object.keys(query).forEach((key) => {
    const value = query[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParams.set(key, value);
    }
  });
  const queryString = queryParams.toString();
  if (queryString && queryString.length) {
    return `${path}?${queryParams.toString()}`;
  }
  return path;
}

function getSortOrder(prop) {
  return (a, b) => {
    if (a[prop] < b[prop]) {
      return 1;
    }
    if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}

function formatSecondsAsTime(currentTime, options = {}) {
  let hr = Math.floor(currentTime / 3600);
  let min = Math.floor((currentTime - hr * 3600) / 60);
  let sec = Math.floor(currentTime - hr * 3600 - min * 60);
  if (options.isString) {
    if (hr < 1) {
      return `${min}m ${sec}s`;
    }
    return `${hr}h ${min}m ${sec}s`;
  }
  if (hr < 10 && hr > 0) {
    hr = `0${hr}`;
  }
  if (min < 10) {
    min = `0${min}`;
  }
  if (sec < 10) {
    sec = `0${sec}`;
  }
  if (hr > 0) {
    return `${hr}:${min}:${sec}`;
  }
  return `${min}:${sec}`;
}

function initialCapital(string) {
  if (typeof string === 'string' && string.length) {
    return string[0].toUpperCase() + string.slice(1);
  }

  return string;
}

function initialLowerCase(string) {
  if (typeof string === 'string' && string.length) {
    return string[0].toLowerCase() + string.slice(1);
  }
  return string;
}

function getCountDisplayValue(count) {
  if (!count || Number.isNaN(count)) return 0;
  if (count > 99 && count <= 999) {
    return `${HRNumbers.toHumanString(10 * Math.floor(count / 10))}+`;
  }
  if (count > 999) {
    return `${HRNumbers.toHumanString(100 * Math.floor(count / 100))}+`;
  }
  return count;
}

function getCountDisplayValueNumberOnly(count) {
  if (count > 99 && count <= 999) {
    return `${HRNumbers.toHumanString(10 * Math.floor(count / 10))}`;
  }
  if (count > 999) {
    return `${HRNumbers.toHumanString(100 * Math.floor(count / 100))}`;
  }
  return count;
}

function dateFormat(date) {
  if (isToday(new Date(date))) {
    return 'Today';
  }
  if (isTomorrow(new Date(date))) {
    return 'Tomorrow';
  }
  return format(new Date(date), 'EEE, MMM dd');
}

function getQueryFor(row) {
  if (!MOBILE_ROW_QUERIES[row] || !MOBILE_ROW_QUERIES[row].category) {
    return null;
  }
  if (MOBILE_ROW_QUERIES[row].category) {
    const res = {
      queryCategory: MOBILE_ROW_QUERIES[row].category,
      overrideDurationFilter: 4,
      useDayBucket: null,
      title: MOBILE_ROW_QUERIES[row].title,
    };
    return res;
  }
  return MOBILE_ROW_QUERIES[row].query;
}

function getSha1Hash(inputString, { lowercase = true } = {}) {
  if (!inputString || typeof inputString !== 'string') return '';
  let input = inputString;
  if (lowercase) {
    input = inputString.toLowerCase();
  }
  const shasum = crypto.createHash('sha1');
  shasum.update(input);
  return shasum.digest('hex');
}

const SESSISON_NAMES = {
  'free-discovery': 'Free Discovery',
  'paid-service-individual': 'Paid Service',
  'paid-coaching': 'Paid Coaching',
};

const getSessionsByMinutes = (packages, mins) => {
  return packages
    ?.filter(
      (item) =>
        item.features.find((itemConfig) => itemConfig.feature === 'video')
          .duration === mins
    )
    .sort(
      (a, b) => a.features[0].numberOfSessions - b.features[0].numberOfSessions
    );
};

const isAndroidDevice = () => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const { userAgent } = window.navigator;
  if (!userAgent) return false;
  if (/android/i.test(userAgent)) {
    return true;
  }
  return false;
};

const isIosDevice = () => {
  if (typeof window === 'undefined' || !window.navigator) return false;
  const { userAgent } = window.navigator;
  if (!userAgent) return false;
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return true;
  }
  return false;
};

const generateMD5Hash = (inputString) => {
  if (!inputString) return '';
  return crypto.createHash('md5').update(inputString).digest('hex');
};

function convertToDollar(cent) {
  if (!cent) return 0;
  return cent / 100;
}

module.exports = {
  isClient,
  isProdMode,
  isTestMode,
  isAndroidDevice,
  isIosDevice,
  getCookie,
  generateQueryPath,
  getSortOrder,
  generateExternalUrlQueryPath,
  formatSecondsAsTime,
  initialCapital,
  getCountDisplayValue,
  dateFormat,
  getQueryFor,
  getCountDisplayValueNumberOnly,
  SESSISON_NAMES,
  getSessionsByMinutes,
  getSha1Hash,
  generateMD5Hash,
  initialLowerCase,
  convertToDollar,
};
