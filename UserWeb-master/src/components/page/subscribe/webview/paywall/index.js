import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { handleGetPricing, setTrialFee } from '@/store/slices/payment';
import { handleUpdatePixelCookies } from '@/store/slices/auth';
import { useDispatch } from 'react-redux';
import { isProdMode, isTestMode } from '@/utils';
import { getTrialFee } from '@/models/payment';
import { Elements } from '@stripe/react-stripe-js';
import Stripe from '@/services/Stripe';
import pricingConstants from '@/utils/constants/pricing';
import Analytics from '@/services/Analytics';
import useTrackSubscriptionView from '@/hooks/trackSubscriptionView';
import { getPaywallAnalyticsProperties } from '@/utils/paywallAnalytics';
import SubscriptionPaywall from './SubscriptionPaywall';
import styles from './style.module.scss';

const PRICING_DATA =
  isProdMode() || isTestMode()
    ? require('../../../../../data/pricing.json')
    : require('../../../../../data/pricing-dev.json');

const MONTHLY_PLAN_ID = 'hKT8pdmjBgaVzSV';
const YEARLY_NO_TRIAL_ID = 'NHkkcVnYWkwFtfh';
const SIXMO_IAP_ID = 'premium2sixmo_49';

// Look the control ($69.99) intro plan up by its explicit pricing id, not by
// iapId. The variant intro plans share the same `premium2year_69_30t` iapId,
// so an iapId `.find()` would be order-dependent and could resolve control
// users to the $79.99/$89.99 entry if the JSON is ever reordered.
const DEFAULT_MONTHLY_INTRO_PLAN =
  PRICING_DATA[pricingConstants.PRICING_INTRO_OFFER] || null;

const BASE_PLANS = {
  monthly: PRICING_DATA[MONTHLY_PLAN_ID] || null,
  yearlyNoTrial: PRICING_DATA[YEARLY_NO_TRIAL_ID] || null,
  sixMonth:
    Object.values(PRICING_DATA).find((item) => item.iapId === SIXMO_IAP_ID) ||
    null,
};

// The $4.99/30-day intro trial always renews at the same yearly price the
// experiment assigned — it isn't a separate Stripe product per variant, just
// the intro-trial version of the same yearly Price object (confirmed w/
// Farhan + product: keep the $4.99 fee flat, only the renewal price changes).
function getPlans(variant) {
  let yearlyId = pricingConstants.PRICING_YEARLY_6999_7DAYS;
  let monthlyIntroPlan = DEFAULT_MONTHLY_INTRO_PLAN;
  if (variant === 'a') {
    yearlyId = pricingConstants.PRICING_YEARLY_7999_7DAYS;
    monthlyIntroPlan =
      PRICING_DATA[pricingConstants.PRICING_MONTHLY_INTRO_7999_30DAYS] ||
      DEFAULT_MONTHLY_INTRO_PLAN;
  } else if (variant === 'c') {
    yearlyId = pricingConstants.PRICING_YEARLY_8999_7DAYS;
    monthlyIntroPlan =
      PRICING_DATA[pricingConstants.PRICING_MONTHLY_INTRO_8999_30DAYS] ||
      DEFAULT_MONTHLY_INTRO_PLAN;
  }
  return {
    ...BASE_PLANS,
    yearly: PRICING_DATA[yearlyId] || null,
    monthlyIntro: monthlyIntroPlan,
  };
}

// Mobile mirrors the native IAP-flow Mixpanel events from these postMessages
// (Yawar's request in PROD-1571). Include productId / revenue / subscriptionId
// so the synthetic mobile events carry the same shape as the native flow.
// Revenue is parsed from `discountedPricing` ("$69.99 USD" -> 69.99), the
// same source the native flow's `SubscriptionPricing` map effectively
// encodes; falls back to 0 when the field is missing.
const parsePlanRevenue = (plan) => {
  if (!plan?.discountedPricing) return 0;
  const numeric = parseFloat(
    String(plan.discountedPricing).replace(/[^0-9.]/g, '')
  );
  return Number.isFinite(numeric) ? numeric : 0;
};

const PaywallContainer = ({ user, variant, ctaAtBottom = false }) => {
  const dispatch = useDispatch();
  const PLANS = useMemo(() => getPlans(variant), [variant]);

  useEffect(() => {
    try {
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'webview_ready' })
        );
      }
    } catch (e) {
      // silently fail
    }
  }, []);

  const [selectedPlan, setSelectedPlan] = useState('yearly');

  useTrackSubscriptionView(
    {
      PricingID: PLANS.yearly?.id,
      PricingName: PLANS.yearly?.name,
      UserID: user?.id,
    },
    [PLANS.yearly, user],
    { redirectedFromApp: true }
  );

  const postMessageToApp = useCallback((message) => {
    try {
      const data = JSON.stringify(message);
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(data);
      }
    } catch (e) {
      // silently fail
    }
  }, []);

  const onSuccessfulSubscription = useCallback(
    async (paymentMethodType, extras = {}) => {
      await dispatch(handleUpdatePixelCookies(user?.id));
      const plan = PLANS[selectedPlan];
      postMessageToApp({
        type: 'payment_success',
        paymentMethodType,
        productId: plan?.iapId || null,
        revenue: parsePlanRevenue(plan),
        plan: selectedPlan,
        subscriptionId: extras?.subscriptionId || null,
        status: extras?.status || null,
      });
    },
    [dispatch, postMessageToApp, user?.id, selectedPlan, PLANS]
  );

  const onPaymentInitiated = useCallback(() => {
    const plan = PLANS[selectedPlan];
    postMessageToApp({
      type: 'payment_initiated',
      productId: plan?.iapId || null,
      revenue: parsePlanRevenue(plan),
      plan: selectedPlan,
    });
  }, [postMessageToApp, selectedPlan, PLANS]);

  const onFailedSubscription = useCallback(
    ({ error, errorCode, status } = {}) => {
      const plan = PLANS[selectedPlan];
      postMessageToApp({
        type: 'payment_error',
        error: error || null,
        errorCode: errorCode || null,
        status: status || null,
        productId: plan?.iapId || null,
        plan: selectedPlan,
      });
    },
    [postMessageToApp, selectedPlan, PLANS]
  );

  const handlePlanChange = useCallback(
    async (planKey) => {
      setSelectedPlan(planKey);
      const plan = PLANS[planKey];
      if (!plan) return;

      await dispatch(handleGetPricing({ id: plan.id })).unwrap();
      if (plan.trial === 0) {
        dispatch(setTrialFee(0));
      } else {
        const fee = getTrialFee(plan);
        dispatch(setTrialFee(fee ? fee * 100 : 0));
      }
    },
    [dispatch, PLANS]
  );

  const onClose = useCallback(() => {
    const plan = PLANS[selectedPlan];
    Analytics.track('Web Subscription Close', {
      UserID: user?.id,
      PricingID: plan?.id,
      PricingName: plan?.name,
      Plan: selectedPlan,
      ...getPaywallAnalyticsProperties({ redirectedFromApp: true }),
    });
    postMessageToApp({ type: 'payment_cancelled' });
  }, [postMessageToApp, PLANS, selectedPlan, user?.id]);

  return (
    <Elements stripe={Stripe.instance}>
      <div className={styles.container}>
        <SubscriptionPaywall
          user={user}
          plans={PLANS}
          selectedPlan={selectedPlan}
          ctaAtBottom={ctaAtBottom}
          onPlanChange={handlePlanChange}
          onClose={onClose}
          onSuccessfulSubscription={onSuccessfulSubscription}
          onPaymentInitiated={onPaymentInitiated}
          onFailedSubscription={onFailedSubscription}
        />
      </div>
    </Elements>
  );
};

export default PaywallContainer;
