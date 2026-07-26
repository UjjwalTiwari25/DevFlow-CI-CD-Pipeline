import loadPixel from './scripts/tiktokPixel';
import config from '../config';
import Logger from './Logger';
import { isProdMode } from '../utils';
import { notifyHandledError } from './ErrorMonitoring';

const isProd = isProdMode();
const pixelId = config.tiktok.pixel;

function isInitialized() {
  return typeof ttq !== 'undefined' && ttq.instance(pixelId);
}

function init() {
  try {
    if (isProd) {
      if (!isInitialized()) {
        Logger.debug('Loading tiktok pixel');
        loadPixel();
        ttq.load(config.tiktok.pixel);
        ttq.page();
        Logger.debug('Loaded tiktok pixel', ttq);
      }
    }
  } catch (error) {
    notifyHandledError(error, { message: 'Failed to load Tiktok pixel' });
  }
}

function trackStandard(event, data) {
  try {
    if (isProd && isInitialized()) {
      ttq.instance(pixelId).track(event, data);
    }
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to send Tiktok standard event',
    });
  }
}

const TiktokPixel = {
  init,
  trackStandard,
};

export default TiktokPixel;
