import Axios from 'axios';
import loadPixel from './scripts/fbPixel';
import config from '../config';
import Logger from './Logger';
import { getCookie, isAndroidDevice, isIosDevice, isProdMode } from '../utils';
import { notifyHandledError } from './ErrorMonitoring';

const isProd = isProdMode();
const PASSTHROUGH_EVENTS = [
  'Sign up start',
  'CompleteRegistration',
  'InitiateCheckout',
  'StartTrial',
  'Purchase',
];

function init() {
  if (isProd) {
    setTimeout(() => {
      if (typeof fbq === 'undefined') {
        Logger.debug('Loading pixel');
        loadPixel();
      }
      if (!fbq.getState || fbq.getState().pixels.length === 0) {
        Logger.debug('Initalizing pixel');

        fbq('init', config.pixel.web);
        if (isAndroidDevice()) {
          fbq('init', config.pixel.webAndroid);
        }
        if (isIosDevice()) {
          fbq('init', config.pixel.webIos);
        }

        trackStandard('PageView');
      }
    }, 1000);
  }
}

function getEventId({ id } = {}) {
  const eventID = id
    ? `${id}.${new Date().getTime()};`
    : `${new Date().getTime()}`;
  return eventID;
}

function trackCustom(event, data, { user, passThroughData } = {}) {
  if (isProd && typeof fbq !== 'undefined') {
    const eventID = getEventId(user || {});
    Logger.debug('FB tracking Custom', { event, data, eventID });
    fbq('trackSingleCustom', config.pixel.web, event, {}, { eventID });
    if (isAndroidDevice()) {
      fbq('trackSingleCustom', config.pixel.webAndroid, event, {}, { eventID });
    }
    if (isIosDevice()) {
      fbq('trackSingleCustom', config.pixel.webIos, event, {}, { eventID });
    }
    trackApiPassthrough(event, {}, { user, eventID, passThroughData });
  }
}

function trackStandard(event, data, { user, passThroughData } = {}) {
  if (isProd && typeof fbq !== 'undefined') {
    const eventID = getEventId(user || {});
    Logger.debug('FB tracking standard', { event, data, eventID });
    fbq('trackSingle', config.pixel.web, event, data, { eventID });

    if (isAndroidDevice()) {
      fbq('trackSingle', config.pixel.webAndroid, event, data, { eventID });
    }
    if (isIosDevice()) {
      fbq('trackSingle', config.pixel.webIos, event, data, { eventID });
    }
    trackApiPassthrough(event, data, { user, eventID, passThroughData });
  }
}

async function trackApiPassthrough(
  event,
  data,
  { user, eventID, passThroughData = {} }
) {
  try {
    Logger.debug('Initiating sending passthrough event', {
      event,
      data,
      user,
      eventID,
      passThroughData,
    });
    if (!PASSTHROUGH_EVENTS.includes(event)) {
      Logger.debug('Ignoring non pass through event', { event, data });
      return;
    }
    const body = {
      id: eventID,
      ...data,
      ...passThroughData,
      user: {
        pixelCookies: { fbp: getFBP(), fbc: getFBC() },
        ...user,
      },
      name: event,
    };
    if (typeof window !== 'undefined') {
      body.sourceUrl = window.location?.href;
    }
    const options = {
      method: 'POST',
      url: `${config.api.auraServices}/pt/pixel`,
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
    };
    const response = await Axios(options);
    // if (!response || !response.data) {
    //   notifyHandledError(null, {
    //     message: 'Received null response from FB passthrough event',
    //     event,
    //     data,
    //   });
    // }
    Logger.debug('Sent passthrough FB pixel event', { response });
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to send FB passthrough event',
      event,
      data,
    });
  }
}

function getFBC() {
  return getCookie('_fbc');
}

function getFBP() {
  return getCookie('_fbp');
}

const FbPixel = {
  init,
  trackCustom,
  trackStandard,
  getFBC,
  getFBP,
};

export default FbPixel;
