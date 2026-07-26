import { isClient } from '../utils';
import Logger from './Logger';
import {
  getDataLayerSnippet,
  getGTMScript,
  getIframeSnippet,
} from './scripts/googleTagManager';
/**
 * Function to setup the Google Tag Manager
 */
const setupGTM = () => {
  const getDataLayerScript = () => {
    const dataLayerScript = document.createElement('script');
    dataLayerScript.innerHTML = getDataLayerSnippet();
    return dataLayerScript;
  };
  const getNoScript = () => {
    const noScript = document.createElement('noscript');
    noScript.innerHTML = getIframeSnippet();
    return noScript;
  };
  const getScript = () => {
    const script = document.createElement('script');
    script.innerHTML = getGTMScript();
    return script;
  };
  return {
    getDataLayerScript,
    getNoScript,
    getScript,
  };
};
/**
 * Function to init the GTM
 */
const initGTM = () => {
  const gtm = setupGTM();
  const dataLayerScript = gtm.getDataLayerScript();
  const script = gtm.getScript();
  const noScript = gtm.getNoScript();
  document.head.insertBefore(dataLayerScript, document.head.childNodes[0]);
  document.head.insertBefore(script, document.head.childNodes[0]);
  document.body.insertBefore(noScript, document.body.childNodes[0]);
};
/**
 * Function to send the events to the GTM
 * @param data - The data to push
 */
const sendToGTM = ({ data }) => {
  if (isClient() && window.dataLayer && data) {
    window.dataLayer.push(data);
  } else {
    Logger.warn('GTM Tag not initialized');
  }
};

const GTMService = {
  initGTM,
  sendToGTM,
};

export default GTMService;
