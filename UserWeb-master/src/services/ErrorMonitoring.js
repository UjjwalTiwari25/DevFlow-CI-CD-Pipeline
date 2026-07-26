import BugsnagClient from './Bugsnag';
import Logger from './Logger';

function notifyAPIError(error, { message, ...metadata } = {}) {
  if (message) {
    Logger.warn(message, { metadata, error });
  }
  const handledError = error || new Error(message);
  const headers = error?.response?.headers;
  BugsnagClient.notify(handledError, (event) => {
    if (headers) {
      event.addMetadata('Transaction', {
        transactionSlice: headers['x-response-id-slice'],
        transactionId: headers['x-response-id'],
      });
    }
    event.addMetadata('CUSTOM', { message, ...metadata });
  });
}

function notifyHandledError(error, { message, ...metadata } = {}) {
  if (message) {
    Logger.warn(message, { metadata, error });
  }
  const handledError = error || new Error(message);
  BugsnagClient.notify(handledError, (event) => {
    event.addMetadata('CUSTOM', { message, ...metadata });
  });
}

export { notifyAPIError, notifyHandledError };
