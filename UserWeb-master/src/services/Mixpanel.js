import mixpanel from 'mixpanel-browser';
import config from '../config';
import appConstants from '../utils/constants/app';
import Logger from './Logger';
import LocalStorage from './LocalStorage';

let isInitialized = false;

function init() {
  if (!isInitialized) {
    Logger.debug('Initializing mixpanel');
    mixpanel.init(config.mixpanel.token, {
      cross_subdomain_cookie: false,
      cookie_domain: window.location.hostname,
    });
    isInitialized = true;
  }
}

function identify(id, isNewUser) {
  if (!isInitialized) {
    return;
  }
  if (isNewUser) {
    mixpanel.alias(id);
  }
  mixpanel.identify(id);
}

function track(event, data) {
  if (!isInitialized) {
    return;
  }
  mixpanel.track(event, {
    Time: new Date().getHours(),
    Day: new Date().getDay(),
    'Sent from': appConstants.APP_NAME,
    Platform: appConstants.APP_NAME,
    'Source App': appConstants.SOURCE_APP,
    ...data,
  });
}

function signOut() {
  if (!isInitialized) {
    return;
  }
  track('User Logout');
  mixpanel.reset();
  LocalStorage.setItem('mixpanel_event_sent', false);
}

function setSuperProperties(data) {
  if (!isInitialized) {
    return;
  }
  mixpanel.register(data);
}

function setPeopleProperties(data) {
  if (!isInitialized) {
    return;
  }
  mixpanel.people.set(data);
}

const Mixpanel = {
  init,
  identify,
  signOut,
  track,
  setSuperProperties,
  setPeopleProperties,
};

export default Mixpanel;
