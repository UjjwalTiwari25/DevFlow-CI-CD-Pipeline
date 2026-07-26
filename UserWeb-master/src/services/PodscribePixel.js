import loadPixel from './scripts/podscribePixel';
import Logger from './Logger';
import { isProdMode } from '../utils';
import { notifyHandledError } from './ErrorMonitoring';

const isProd = isProdMode();

function init() {
  try {
    if (isProd) {
      setTimeout(() => {
        if (typeof podscribe === 'undefined') {
          Logger.debug('Loading podscribe pixel');
          loadPixel();
        }
      }, 1000);
    }
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to initialize Podscribe pixel',
    });
  }
}

function lead(data) {
  try {
    if (typeof podscribe !== 'undefined') {
      Logger.debug('Track lead podscribe pixel');
      podscribe('lead', data);
    }
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to send Podscribe lead data',
    });
  }
}

function signUp(data) {
  try {
    if (typeof podscribe !== 'undefined') {
      Logger.debug('Track lead podscribe sign up');
      podscribe('signup', data);
    }
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to send Podscribe signup data',
    });
  }
}

function purchase(data) {
  try {
    if (typeof podscribe !== 'undefined') {
      Logger.debug('Track lead podscribe purchase');
      podscribe('purchase', data);
    }
  } catch (error) {
    notifyHandledError(error, {
      message: 'Failed to send Podscribe purchase data',
    });
  }
}

const PodscribePixel = {
  init,
  lead,
  signUp,
  purchase,
};

export default PodscribePixel;
