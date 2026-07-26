import Logger from '@/services/Logger';
import LOCALES from '../data/locales.json';
import appConstants from '../utils/constants/app';

const getAllLocales = ({ type = 'app' } = {}) => {
  let filteredLocales = {};
  if (type === 'unfiltered') filteredLocales = LOCALES;
  else if (type === 'app') {
    Object.keys(LOCALES).forEach((locale) => {
      if (LOCALES[locale].enabled) filteredLocales[locale] = LOCALES[locale];
    });
  }
  return filteredLocales;
};

const getLocaleConfig = (locale) => {
  return LOCALES[locale] || LOCALES[appConstants.DEFAULT_LOCALE];
};

const getLocaleImage = (src, locale) => {
  if (locale === appConstants.DEFAULT_LOCALE) {
    return src;
  }
  const [imgPath, imgExtension] = src.split('.');
  const localeImageSrc = `${imgPath}-${locale}.${imgExtension}`;
  return localeImageSrc;
};

const getISOLocale = (locale) => {
  if (!locale) return null;
  const [language, country] = locale.split('-');
  if (!country) return locale;
  return `${language}_${country.toUpperCase()}`;
};

const getUserPreferredLocale = ({ firstPreferenceOnly } = {}) => {
  let preferredLocale = null;
  if (typeof window === 'undefined' || !window.navigator?.language) {
    return preferredLocale;
  }
  const locales = getAllLocales();

  const matchNavigatorLanguage = (language) => {
    Logger.debug('Looking for locale match', { language });
    const browserLocale = language.replace('-', '_');
    if (locales[browserLocale]) {
      Logger.debug('Found locale exact match from browser preference', {
        language,
      });
      return locales[browserLocale];
    }
    const [majorBrowserLocale] = browserLocale.split('_');
    if (locales[majorBrowserLocale]) {
      Logger.debug('Found major locale match from browser preference', {
        language,
        majorBrowserLocale,
      });
      return locales[majorBrowserLocale];
    }
    return null;
  };

  if (firstPreferenceOnly) {
    Logger.debug(
      'Matching first browser locale preference',
      navigator.language
    );
    preferredLocale = matchNavigatorLanguage(navigator.language);
  } else {
    navigator.languages?.some((language) => {
      const matchedLocale = matchNavigatorLanguage(language);
      if (matchedLocale && matchedLocale.id) {
        preferredLocale = matchedLocale.id;
        return true;
      }
      return false;
    });
  }
  return preferredLocale;
};

const getUrlLocale = (isoLocale) => {
  if (!isoLocale) return '';
  if (isoLocale === appConstants.DEFAULT_LOCALE) return '';
  const [language, country] = isoLocale.split('_');
  if (!country) return `${isoLocale}/`;
  return `${language}-${country.toLowerCase()}/`;
};

export {
  getAllLocales,
  getISOLocale,
  getLocaleConfig,
  getLocaleImage,
  getUserPreferredLocale,
  getUrlLocale,
};
