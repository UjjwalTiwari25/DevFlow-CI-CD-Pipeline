import { useEffect, useRef } from 'react';
import Analytics from '../services/Analytics';
import useAuthUser from './authUser';
import { getPaywallAnalyticsProperties } from '../utils/paywallAnalytics';

/**
 * Fires `Web Subscription View` once when a subscription checkout/paywall page is shown.
 */
function useTrackSubscriptionView(
  data = {},
  dependencies = [],
  { redirectedFromApp = false } = {}
) {
  const isEventSent = useRef(false);
  const { user, isLoading, authLoading } = useAuthUser();

  useEffect(() => {
    if (isEventSent.current) return;
    if (!dependencies.every((item) => !!item)) return;
    if (!user && (isLoading || authLoading)) return;

    const eventData = { ...data };
    if (user) {
      Analytics.signIn(user);
      eventData.UserID = user.id;
    }

    Analytics.track('Web Subscription View', {
      ...eventData,
      ...getPaywallAnalyticsProperties({ redirectedFromApp }),
    });
    isEventSent.current = true;
  }, [data, dependencies, isLoading, authLoading, user, redirectedFromApp]);
}

export default useTrackSubscriptionView;
