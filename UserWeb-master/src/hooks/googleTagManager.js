import { useCallback, useEffect } from 'react';
import Router from 'next/router';
import GTMService from '../services/GoogleTagManager';
import Logger from '../services/Logger';
import { isClient } from '../utils';
import routeConstants from '../utils/constants/routes';
/**
 * The Google Tag Manager Hook
 */
export default function useGTM() {
  const isInitialized = isClient() ? window.isGTMSetup : false;
  const sendDataToGTM = useCallback((data) => {
    GTMService.sendToGTM({ data });
  }, []);
  useEffect(() => {
    if (!isInitialized) {
      Logger.debug('Initializing GTM');
      GTMService.initGTM();
      window.isGTMSetup = true;
    }
    sendDataToGTM({
      event: 'cookie_consent_update',
    });
    sendDataToGTM({
      event: 'pageView',
      isOnboardingPage:
        routeConstants.ONBOARDING_PAGES.filter((path) => {
          return Router.pathname.includes(path);
        }).length > 0,
    });
  }, []); // Don't need dependencies here. Should be only fired once on a page

  return {
    sendDataToGTM,
  };
}
