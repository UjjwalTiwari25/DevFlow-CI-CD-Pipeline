const isLocalStorageAvailable = () => {
  try {
    const storage = window.localStorage;
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

function setItem(key, value) {
  if (!isLocalStorageAvailable()) {
    return;
  }
  if (!key) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
  if (!isLocalStorageAvailable()) {
    return;
  }
  if (!key) {
    return;
  }
  window.localStorage.removeItem(key);
}

function getItem(key) {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  if (!key) {
    return null;
  }
  let value = window.localStorage.getItem(key);
  if (value) {
    value = JSON.parse(value);
  }
  return value;
}

const KEYS = {
  LOGIN_EVENT_SENT: 'LOGIN_EVENT_SENT',
  LAST_LOGIN: 'LAST_LOGIN',
  USER_INSTALL_ADSET_NAME: 'USER_INSTALL_ADSET_NAME',
  USER_INSTALL_AFFILIATE_ID: 'USER_INSTALL_AFFILIATE_ID',
  USER_INSTALL_CELEBRITY_ID: 'USER_INSTALL_CELEBRITY_ID',
  USER_INSTALL_SOURCE: 'USER_INSTALL_SOURCE',
  USER_INSTALL_CAMPAIGN: 'USER_INSTALL_CAMPAIGN',
  USER_INSTALL_MEDIUM: 'USER_INSTALL_MEDIUM',
  USER_INSTALL_CONTENT: 'USER_INSTALL_CONTENT',
  USER_INSTALL_CAMPAIGN_ID: 'USER_INSTALL_CAMPAIGN_ID',
  USER_INSTALL_ADSET_ID: 'USER_INSTALL_ADSET_ID',
  USER_INSTALL_AD_ID: 'USER_INSTALL_AD_ID',
  USER_INSTALL_SITE_SOURCE: 'USER_INSTALL_SITE_SOURCE',
  USER_INSTALL_CAMPAIGN_NAME: 'USER_INSTALL_CAMPAIGN_NAME',
  USER_INSTALL_LANGUAGE: 'USER_INSTALL_LANGUAGE',
  USER_INSTALL_TERM: 'USER_INSTALL_TERM',
  HOME_PAGE_EMAIL_INVITATION: 'HOME_PAGE_EMAIL_INVITATION',
  PLAYER_PAGE_EMAIL_INVITATION: 'PLAYER_PAGE_EMAIL_INVITATION',
  PAYMENT_COUNTDOWN_MINUTES: 'PAYMENT_COUNTDOWN_MINUTES',
  PAYMENT_COUNTDOWN_SECONDS: 'PAYMENT_COUNTDOWN_SECONDS',
  LAST_VISIT: 'LAST_VISIT',
  VISITED_COUNT: 'VISITED_COUNT',
  CLOSED_CLAIM_SPECIAL_GUEST_PASS_BANNER:
    'CLOSED_CLAIM_SPECIAL_GUEST_PASS_BANNER',
  GOOGLE_COOKIES: 'GOOGLE_COOKIES',
};

const LocalStorage = {
  isAvailable: isLocalStorageAvailable,
  setItem,
  getItem,
  removeItem,
  KEYS,
};

module.exports = LocalStorage;
