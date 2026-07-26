import Logger from './Logger';

function init({ preventMixpanel } = {}) {
  Logger.info('Analytics.init', { preventMixpanel });
}

function initMixpanel() {
  Logger.info('Analytics.initMixpanel');
}

function identifyUser(user, isNewUser) {
  Logger.info('Analytics.identifyUser', user, isNewUser);
}

function authLogin(auth) {
  Logger.info('Analytics.authLogin', auth);
}

function signIn(user) {
  Logger.info('Analytics.signIn', user);
}

function setSuperProperties(data) {
  Logger.info('Analytics.setSuperProperties', data);
}

function setPeopleProperties(data) {
  Logger.info('Analytics.setPeopleProperties', data);
}

function track(event, data) {
  Logger.info('Analytics.track', event, data);
}

function getPixelCookies() {}

function resetUser() {}

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
};

export default Analytics;
