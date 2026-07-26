import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import FbPixel from '@/services/FbPixel';
import useTheme, { THEMES } from '@/hooks/theme';
import PostAffiliatePro from '@/services/PostAffiliatePro';
import { getCelebrityById } from '@/models/celebrities';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useCountyBasedPricing from '@/hooks/useCountyBasedPricing';
import pricingConstants from '@/utils/constants/pricing';
import BaseLayout from '../../../layouts/BaseLayout';
import { wrapper } from '../../../store';
import {
  handleGetPricing,
  setCelebrity,
  setCoach,
} from '../../../store/slices/payment';
import usePageQuery from '../../../hooks/pageQuery';
import SubscribePricing from '../../../components/page/subscribe/[pricing]';
import { getPromoCodes, getPromoCode } from '../../../models/payment';
import ChooseYourFee from '../../../components/payment/ChooseYourFee';
import useAuthUser from '../../../hooks/authUser';
import useExperiments from '../../../hooks/experiments';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { getCoach } from '../../../models/coach';
import Loader from '../../../components/app/Loader';
import Logger from '../../../services/Logger';
import { isProdMode, isTestMode } from '../../../utils';
import useThemeListener from '../../../hooks/themeListener';
import TiktokPixel from '../../../services/TiktokPixel';
import { updateUserProfile } from '../../../store/slices/auth';
import useTrackPageView from '../../../hooks/trackPageView';
import useTrackSubscriptionView from '../../../hooks/trackSubscriptionView';
import Analytics from '../../../services/Analytics';

const PRICING_DATA =
  isProdMode() || isTestMode()
    ? require('../../../data/pricing.json')
    : require('../../../data/pricing-dev.json');

const screens = ['chooseFee', 'signup'];
const EXPERIMENTS = ['countryBasedPricingUSD', 'webYearlyPricing'];

function Subscribe(serverProps) {
  const { promoErrorMessage, promoHideMessage, promo } = serverProps;
  const { user, isLoading } = useAuthUser();
  const [showFollowUpDiscount, setShowFollowUpDiscount] = useState(false);
  const dispatch = useDispatch();
  const purchaseModalRef = useRef(null);
  const { t } = useTranslations();

  const pageQuery = usePageQuery({
    fetchUserFromQuery: true,
  });

  const {
    userId = null,
    coachId = null,
    celeb_id: celebrityId = null,
    referralCode,
    referralType,
    utm_source,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
    isShareReferral,
    playlistId,
    noTrial3SKUs,
    threeSKUV2,
  } = pageQuery;

  if (
    noTrial3SKUs &&
    (noTrial3SKUs === true || noTrial3SKUs.toLowerCase() === 'true')
  ) {
    EXPERIMENTS.push('noTrial3SKUs');
  }

  if (
    threeSKUV2 &&
    (threeSKUV2 === true || threeSKUV2.toLowerCase() === 'true') &&
    !EXPERIMENTS.includes('threeSKUsV2')
  ) {
    EXPERIMENTS.push('threeSKUsV2');
  }
  const [experiments] = useExperiments(EXPERIMENTS, user);

  const { pricing, isCoaching, isCelebrity } = useShallowEqualSelector(
    ({ payment }) => payment
  );
  const eventProperties = {
    'Referral Type': referralType,
    'Referral Code': referralCode,
    UserID: userId,
    PricingID: pricing && pricing.id,
    PricingName: pricing && pricing.name,
    attribution: utm_source,
    campaign: utm_campaign,
    medium: utm_medium,
    content: utm_content,
    PromoCode: promo,
  };
  useCountyBasedPricing({ experiments, pricingId: pricing?.id });
  useTrackPageView(eventProperties, [pricing]);
  useTrackSubscriptionView(eventProperties, [pricing], {
    redirectedFromApp: false,
  });

  useEffect(() => {
    const variant = experiments?.webYearlyPricing;
    if (isCoaching) return;
    if (
      variant === 'a' &&
      pricing?.id !== pricingConstants.PRICING_YEARLY_7999_7DAYS
    ) {
      dispatch(
        handleGetPricing({ id: pricingConstants.PRICING_YEARLY_7999_7DAYS })
      );
    } else if (
      variant === 'c' &&
      pricing?.id !== pricingConstants.PRICING_YEARLY_8999_7DAYS
    ) {
      dispatch(
        handleGetPricing({ id: pricingConstants.PRICING_YEARLY_8999_7DAYS })
      );
    }
  }, [experiments, pricing?.id, isCoaching]);

  useEffect(() => {
    if (utm_source === 'affiliate') {
      PostAffiliatePro.init();
    }
  }, [utm_source]);

  const showWebNewCoachingFlow = 'b';

  useEffect(() => {
    async function getCoachFromId() {
      const coachDetails = await getCoach(coachId);
      dispatch(setCoach(coachDetails));
    }
    if (coachId) {
      getCoachFromId();
    }
  }, [coachId, dispatch, utm_source]);

  useEffect(() => {
    async function getCelebrityFromId() {
      const celebrityDetails = await getCelebrityById(celebrityId);
      dispatch(setCelebrity(celebrityDetails));
    }
    if (celebrityId) {
      getCelebrityFromId();
    }
  }, [celebrityId, dispatch]);

  useEffect(() => {
    // Save value of new coaching flow to user profile - this is required if user visits page directly without going through signup
    if (showWebNewCoachingFlow && user?.id) {
      dispatch(
        updateUserProfile({
          profile: { showWebNewCoachingFlow },
          id: user?.id,
          saveToDatabase: true,
        })
      );
    }
  }, [showWebNewCoachingFlow, user?.id, dispatch]);

  useEffect(() => {
    const webYearlyPriceVariant = experiments?.webYearlyPricing;
    if (
      !isCoaching &&
      webYearlyPriceVariant &&
      user?.id &&
      !user?.webYearlyPriceVariant
    ) {
      dispatch(
        updateUserProfile({
          profile: { webYearlyPriceVariant },
          id: user?.id,
          saveToDatabase: true,
        })
      );
    }
  }, [
    experiments?.webYearlyPricing,
    isCoaching,
    user?.id,
    user?.webYearlyPriceVariant,
    dispatch,
  ]);

  useTheme(isCoaching || isShareReferral ? THEMES.LIGHT : THEMES.DARK);

  const { isDark } = useThemeListener();
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [fee, setFee] = useState('0.99');

  useEffect(() => {
    if (currentScreenIndex === 1) {
      setTimeout(() => {
        if (
          (purchaseModalRef &&
            purchaseModalRef.current &&
            !isCoaching &&
            currentScreenIndex === 1) ||
          !(!promo || (promo && promoErrorMessage)) ||
          isCelebrity
        ) {
          purchaseModalRef.current.show();
        }
      }, 5000);
    }
  }, [
    currentScreenIndex,
    isCelebrity,
    isCoaching,
    promo,
    promoErrorMessage,
    pricing,
  ]);

  return (
    <BaseLayout
      useAuth
      isUserFromQuery={!!userId}
      hideBackground={true}
      isDarkMode={isDark}
      hideFooterBackground={true}
      onAnalyticsInit={() => {
        TiktokPixel.trackStandard('AddToCart', { content_id: user?.id });
      }}>
      <Head>
        <title>{t('meta_subscribe_title')}</title>
        <meta name="description" content={t('meta_subscribe_description')} />
        <meta property="og:title" content={t('meta_subscribe_title')} />
        <meta
          property="og:description"
          content={t('meta_subscribe_description')}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      {pricing &&
        !isLoading &&
        experiments &&
        (!pricing.noTrialFee &&
        pricing.trial !== 0 &&
        (!promo || (promo && promoErrorMessage)) &&
        !isCelebrity &&
        !isShareReferral &&
        !playlistId ? (
          <PaymentPageScreens
            setTotalPrice={
              fee === '0.99' ||
              fee === '1.99' ||
              fee === '3.99' ||
              fee === '2.99' ||
              fee === '4.99' ||
              fee === '9.99'
            }
            fee={fee}
            setFee={(selectedFee) => {
              Analytics.track('Web Subscription Select Trial Fee', {
                ...eventProperties,
                TrialFee: selectedFee,
              });
              FbPixel.trackStandard('AddToCart', {}, { user });
              setFee(selectedFee);
            }}
            screen={screens[currentScreenIndex]}
            onNext={() => {
              if (currentScreenIndex + 1 < screens.length) {
                setCurrentScreen(currentScreenIndex + 1);
              }
            }}
            onBack={() => {
              if (currentScreenIndex === 0) {
                window.history.go(-1);
                return;
              }
              if (showFollowUpDiscount) return;
              setCurrentScreen(currentScreenIndex - 1);
              window.scrollTo(0, 0);
            }}
            promoErrorMessage={promoErrorMessage}
            promoHideMessage={promoHideMessage}
            promo={promo}
            experiments={experiments}
            user={user}
            profile={user}
            showFollowUpDiscount={showFollowUpDiscount}
            setShowFollowUpDiscount={setShowFollowUpDiscount}
            purchaseModalRef={purchaseModalRef}
            isShareReferral={isShareReferral}
          />
        ) : (
          <SubscribePricing
            promoErrorMessage={promoErrorMessage}
            promoHideMessage={promoHideMessage}
            promo={promo}
            experiments={experiments}
            user={user}
            isShareReferral={isShareReferral}
            purchaseModalRef={purchaseModalRef}
          />
        ))}
      {(!pricing || isLoading || !experiments) && <Loader />}
    </BaseLayout>
  );
}
function PaymentPageScreens({ screen, ...props }) {
  switch (screen) {
    case 'chooseFee':
      return <ChooseYourFee {...props} />;
    case 'signup':
      return <SubscribePricing {...props} />;
    default:
      return null;
  }
}
export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params, locale }) => {
      const { pricing } = params;
      let promoErrorMessage = null;
      let pricingId = null;
      let promo = null;
      let promoHideMessage = false;
      const pricingIdObj = PRICING_DATA[pricing];
      if (pricingIdObj) {
        pricingId = pricingIdObj.id;
      }
      // fetching promos from firebase
      if (!pricingId) {
        // escaping spaces and case sensitivity
        promo = pricing.replace(/\s/g, '').toUpperCase();
        const promoCode = await getPromoCode(pricing);
        promoHideMessage = (promoCode && promoCode.hideMessage) || false;
        if (promoCode && promoCode.active === false) {
          promoErrorMessage = `Promo code: ${promo} has expired`;
        } else if (promoCode) {
          const pricingObj = Object.values(PRICING_DATA).find(
            (item) =>
              item.discountDescription === promoCode.discount &&
              item.trial === promoCode.trial &&
              item.type !== 'coaching'
          );
          if (pricingObj) {
            pricingId = pricingObj.id;
          } else {
            promoErrorMessage = `Promo code: ${promo} is invalid`;
          }
        } else {
          promoErrorMessage = `Promo code: ${promo} is invalid`;
        }
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      const pricingDetails = await store.dispatch(
        handleGetPricing({ id: pricingId })
      );
      if (!pricingDetails || (pricingDetails && !pricingDetails.payload)) {
        Logger.warn('No pricing found', {
          pricingId,
          pricing,
          promo,
        });
        return { notFound: true };
      }
      return {
        props: {
          promoErrorMessage,
          promoHideMessage,
          promo,
          ...(await I18N.loadLocale({ locale, route: '/subscribe/[pricing]' })),
        },
      };
    }
);

export async function getStaticPaths() {
  const paths = [];
  Object.values(PRICING_DATA).forEach((pricing) => {
    paths.push({ params: { pricing: pricing.id } });
  });
  // add promo paths to static paths
  const promos = await getPromoCodes();
  Object.values(promos).forEach((promo) => {
    paths.push({ params: { pricing: promo.code } });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export default Subscribe;
