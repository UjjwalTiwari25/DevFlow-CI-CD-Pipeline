import { getCookie } from '@/utils';
import Mixpanel from './Mixpanel';
import Bugsnag from './Bugsnag';
import appConstants from '../utils/constants/app';
import FbPixel from './FbPixel';
import GTMService from './GoogleTagManager';
import Logger from './Logger';
import LocalStorage from './LocalStorage';
// import TiktokPixel from './TiktokPixel';
import ImpactPixel from './ImpactPixel';
import PodscribePixel from './PodscribePixel';

function init({ preventMixpanel } = {}) {
  if (!preventMixpanel) {
    Mixpanel.init();
  }
  FbPixel.init();
  // TiktokPixel.init();
  PodscribePixel.init();
  ImpactPixel.init();
}

function initMixpanel() {
  Mixpanel.init();
}

function identifyUser(user, isNewUser) {
  if (user && user.id) {
    const {
      id,
      email,
      premium,
      premiumCoaching,
      premiumTrial,
      morningRoutineProgressCount = 0,
      meditationProgressCount = 0,
      morningStreak = 0,
      morningStreakMax = 0,
      givenName,
      ageMin,
      ageMax,
      gender,
    } = user;
    Mixpanel.identify(id, isNewUser);
    Bugsnag.user = {
      id,
      name: givenName,
      email,
    };
    const superProperties = {
      UserID: id,
      Name: givenName,
      Premium: premium || premiumTrial || false,
      PremiumCoaching: premiumCoaching || false,
      'Day N': morningRoutineProgressCount,
      'Session N': meditationProgressCount,
      morningStreak,
      morningStreakMax,
    };
    if (ageMin || ageMax) {
      superProperties['Age Min'] = ageMin;
      superProperties['Age Max'] = ageMax;
    }
    if (gender) {
      superProperties.Gender = gender;
    }
    setSuperProperties(superProperties);
    Logger.addUserData({
      id,
      givenName,
      email,
      premium,
      premiumTrial,
      premiumCoaching,
    });
    ImpactPixel.identify({ userId: id, email });
  }
}

function authLogin(auth) {
  const { user = {} } = auth || {};
  const { displayName, email, providerId, uid } = user || {};
  track('Firebase Auth Login', {
    Name: displayName,
    Email: email,
    Provider: providerId,
    UserID: uid,
  });
}

function signIn(user) {
  if (!user || !user.id) {
    return;
  }
  identifyUser(user);
  if (LocalStorage.isAvailable()) {
    const flag = LocalStorage.getItem(LocalStorage.KEYS.LOGIN_EVENT_SENT);
    const setTime = new Date(
      LocalStorage.getItem(LocalStorage.KEYS.LAST_LOGIN)
    );
    const thirtyMinutes = 60 * 30 * 1000;
    if (!flag || new Date() - setTime > thirtyMinutes) {
      track('Login');
      LocalStorage.setItem(LocalStorage.KEYS.LOGIN_EVENT_SENT, true);
      LocalStorage.setItem(
        LocalStorage.KEYS.LAST_LOGIN,
        new Date().toISOString()
      );
    }
  } else {
    track('Login');
  }
}

function setSuperProperties(data) {
  Mixpanel.setSuperProperties(data);
}

function setPeopleProperties(data) {
  Mixpanel.setPeopleProperties(data);
}

function sendDebugEvent(event, data) {
  Logger.debug(event, data);
  Bugsnag.leaveBreadcrumb(event, data);
}

function track(event, data) {
  Mixpanel.track(event, {
    Time: new Date().toTimeString().slice(0, 2),
    Day: new Date().getDay(),
    'Sent from': appConstants.APP_NAME,
    ...data,
  });
  Bugsnag.leaveBreadcrumb(event, data);
  GTMService.sendToGTM({
    data: {
      event,
      ...data,
    },
  });
  FbPixel.trackCustom(event, data);
  Logger.debug(event, { data });
}

function getPixelCookies() {
  const pixelCookies = {
    fbp: FbPixel.getFBP(),
    fbc: FbPixel.getFBC(),
  };
  return pixelCookies;
}

function getTwitterCookies() {
  const twCookie = getCookie('_twclid');
  const parsedCookie = twCookie ? JSON.parse(twCookie) : null;
  const twitterCookies = {
    twclid: parsedCookie?.twclid || null,
  };
  return twitterCookies;
}

function getGoogleCookies() {
  const parsedCookie = LocalStorage.getItem(LocalStorage.KEYS.GOOGLE_COOKIES);
  const googleCookies = {
    gclid: parsedCookie?.gclid || null,
    gbraid: parsedCookie?.gbraid || null,
    wbraid: parsedCookie?.wbraid || null,
  };
  return googleCookies;
}

function setGoogleCookies({ gclid, gbraid, wbraid } = {}) {
  if (!gclid && !gbraid && !wbraid) return;
  Logger.debug('Saving google cookies', { gclid, gbraid, wbraid });
  LocalStorage.setItem(LocalStorage.KEYS.GOOGLE_COOKIES, {
    gclid,
    gbraid,
    wbraid,
  });
}

function resetUser() {
  Mixpanel.signOut();
  Bugsnag.user = {};
  if (LocalStorage.isAvailable()) {
    LocalStorage.removeItem(LocalStorage.KEYS.LOGIN_EVENT_SENT);
    LocalStorage.removeItem(LocalStorage.KEYS.LAST_LOGIN);
  }
}

const Analytics = {
  init,
  initMixpanel,
  identifyUser,
  authLogin,
  signIn,
  track,
  getPixelCookies,
  resetUser,
  setSuperProperties,
  setPeopleProperties,
  sendDebugEvent,
  getTwitterCookies,
  getGoogleCookies,
  setGoogleCookies,
};

export default Analytics;
