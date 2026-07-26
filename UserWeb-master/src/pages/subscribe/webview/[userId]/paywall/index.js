import React, { useEffect } from 'react';
import Head from 'next/head';
import Paywall from '@/components/page/subscribe/webview/paywall';
import { isProdMode, isTestMode } from '@/utils';
import { wrapper } from '@/store';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import {
  handleGetPricing,
  setIsIapFlow,
  setTrialFee,
} from '@/store/slices/payment';
import { getTrialFee } from '@/models/payment';
import I18N from '@/services/I18N';
import usePageQuery from '@/hooks/pageQuery';
import { verifySessionCookie } from '@/models/user';
import { handleGetUser } from '@/store/slices/auth';
import useTranslations from '@/hooks/translations';
import BaseLayout from '@/layouts/BaseLayout';
import useAuthUser from '@/hooks/authUser';
import {
  getWebYearlyPricingVariant,
  getPaywallCTAPositionVariant,
} from '@/models/experiments';
import { getAllExperimentsAction } from '@/store/slices/experiments';
import pricingConstants from '@/utils/constants/pricing';
import { useDispatch, useSelector } from 'react-redux';

const PRICING_DATA =
  isProdMode() || isTestMode()
    ? require('../../../../../data/pricing.json')
    : require('../../../../../data/pricing-dev.json');

function getYearlyPlanId(variant) {
  if (variant === 'a') return pricingConstants.PRICING_YEARLY_7999_7DAYS;
  if (variant === 'c') return pricingConstants.PRICING_YEARLY_8999_7DAYS;
  return pricingConstants.PRICING_YEARLY_6999_7DAYS;
}

function SubscribePaywall({ userId: verifiedUserId = null }) {
  const pageQuery = usePageQuery();
  // Prefer the server-verified id (resolved from the session cookie in
  // getServerSideProps); fall back to the URL param for client-side navigation.
  const userId = verifiedUserId || pageQuery.userId || null;
  const { user } = useAuthUser();
  const { t } = useTranslations();
  const dispatch = useDispatch();
  // Global `active` of the mobileYearlyPricing RTDB node — used only as a
  // forced-winner fallback for users with no per-user assignment (see
  // getWebYearlyPricingVariant).
  const mobileYearlyPricingActive = useSelector(
    (state) => state.experiments?.all?.mobileYearlyPricing?.active
  );
  // Global `active` of the auraPaywallCTAPosition RTDB node. This experiment is
  // driven by the global winner (like native): a single-letter `active` applies
  // to everyone. See getPaywallCTAPositionVariant.
  const ctaPositionActive = useSelector(
    (state) => state.experiments?.all?.auraPaywallCTAPosition?.active
  );
  // Pure reader: resolve the variant straight from the fetched profile —
  // web-assigned `webYearlyPriceVariant` first, else the `mobileYearlyPricing`
  // value the Aura mobile app already persisted, else the global forced winner.
  // The webview never assigns. See getWebYearlyPricingVariant.
  const variant = getWebYearlyPricingVariant(user, mobileYearlyPricingActive);
  // auraPaywallCTAPosition experiment (ENGMOB-1908): variant 'a' relocates the
  // CTA button + pricing caption to the very bottom of the paywall scroll,
  // mirroring the native paywall. Driven by the global `active` winner; anything
  // else = control (current layout).
  const ctaAtBottom =
    getPaywallCTAPositionVariant(user, ctaPositionActive) === 'a';

  // Load the global experiments config once so the forced-winner fallback can
  // read `/experiments/mobileYearlyPricing.active`.
  useEffect(() => {
    dispatch(getAllExperimentsAction());
  }, [dispatch]);

  // Fetch the user on mount so we have the profile to read the variant from
  useEffect(() => {
    if (!userId) return;
    dispatch(handleGetUser(userId))
      .unwrap()
      .catch(() => null);
  }, [userId, dispatch]);

  // Once the user is loaded, seed Redux with the correct plan so
  // useStripeCard / Apple Pay reflect the right price. Returning users get the
  // same variant price + standard trial as everyone else (the increased price
  // must reach them too — no trial-suppression).
  useEffect(() => {
    if (!user) return;

    const yearlyPlanId = getYearlyPlanId(variant);
    const yearlyPlan = PRICING_DATA[yearlyPlanId];
    if (!yearlyPlan) return;

    dispatch(handleGetPricing({ id: yearlyPlan.id }))
      .unwrap()
      .then(() => {
        const fee = getTrialFee(yearlyPlan);
        dispatch(setTrialFee(fee ? fee * 100 : 0));
      })
      .catch(() => {});
  }, [variant, user, dispatch]);

  return (
    <BaseLayout
      hideBackgroundImages={true}
      isDarkMode={false}
      hideFooterBackground={true}>
      <Head>
        <title>{t('meta_subscribe_title')}</title>
        <meta name="robots" content="noindex, nofollow" />
        {/* viewport-fit=cover makes env(safe-area-inset-*) resolve to real
            values inside the iOS webview. Without it error toasts (and the
            close button) render at the very top, under the Dynamic Island /
            notch, where the user can't see them. */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link
          rel="preload"
          as="image"
          href="/static/images/paywall/bestOfAppleNewFeather.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/static/images/paywall/appleNew.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/static/images/paywall/paywallTimelineGreen.webp"
        />
      </Head>
      <Paywall user={user} variant={variant} ctaAtBottom={ctaAtBottom} />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, query, locale, req, res }) => {
      const { sessionCookie, expiration } = query;
      if (sessionCookie) {
        const maxAge = expiration
          ? parseInt(expiration, 10) - Date.now()
          : 2 * 60 * 60 * 1000;
        res.setHeader(
          'Set-Cookie',
          `session_cookie=${encodeURIComponent(sessionCookie)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(maxAge / 1000)}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
        );
      }

      // Resolve identity from the mobile-minted session cookie (URL on first
      // open, stored cookie on refresh) rather than trusting the URL param.
      // The verified id is authoritative; fall back to the param only when no
      // valid session is present.
      const session = sessionCookie || req.cookies?.session_cookie;
      let { userId } = params;
      if (session) {
        const verifiedUserId = await verifySessionCookie(session);
        if (verifiedUserId) {
          userId = verifiedUserId;
        }
      }
      if (!userId) {
        return { notFound: true };
      }

      // With a session, the response carries a per-user id — keep it out of the
      // shared CDN cache so one user's id can't be served to another. Without a
      // session it's still keyed by the URL param, so the shared cache is safe.
      res.setHeader(
        'Cache-Control',
        session
          ? 'private, no-store'
          : 's-maxage=60, stale-while-revalidate=300'
      );

      store.dispatch(setAppLocale(getISOLocale(locale)));
      store.dispatch(setIsIapFlow(true));

      return {
        props: {
          userId,
          ...(await I18N.loadLocale({
            locale,
            route: '/subscribe/webview/[userId]/paywall',
          })),
        },
      };
    }
);

export default SubscribePaywall;
