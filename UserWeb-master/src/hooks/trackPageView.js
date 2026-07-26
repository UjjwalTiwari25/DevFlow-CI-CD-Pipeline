import Router from 'next/router';
import { useEffect, useRef } from 'react';
import Analytics from '../services/Analytics';
import routeConstants from '../utils/constants/routes';
import useAuthUser from './authUser';

/**
 * React Hook to send page view events
 * @param {string} event - Name of event to fire
 * @param {Object} data - Date to send with the event
 * @param {string[]} dependencies - List of dependencies. Each dependency should not be null for the event to be sent
 */
function useTrackPageView(data = {}, dependencies = []) {
  const isEventSent = useRef(false);
  const { user, isLoading, authLoading } = useAuthUser();
  useEffect(() => {
    if (!isEventSent.current) {
      if (dependencies.every((item) => !!item)) {
        if (user || (!isLoading && !authLoading)) {
          const eventData = data;
          if (!data['Page Name']) {
            // Use page name from route path if not specified specifically in event data
            eventData['Page Name'] = routeConstants.PAGE_NAMES[Router.pathname];
          }
          eventData['Page Path'] = Router.pathname;
          if (user) {
            Analytics.signIn(user);
            eventData.UserID = user.id;
          }
          Analytics.track('Web Page View', eventData);
          isEventSent.current = true;
        }
      }
    }
  }, [data, dependencies, isLoading, authLoading, user]);
}

export default useTrackPageView;
