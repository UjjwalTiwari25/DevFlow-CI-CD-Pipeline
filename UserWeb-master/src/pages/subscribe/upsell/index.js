import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import useCountyBasedPricing from '@/hooks/useCountyBasedPricing';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import usePageQuery from '../../../hooks/pageQuery';
import useThemeListener from '../../../hooks/themeListener';
import BaseLayout from '../../../layouts/BaseLayout';
import ShareSubscription from '../../../components/page/upsell/ShareSubscription';
import UpsellPage from '../../../components/page/upsell/UpsellPage';
import useAuthUser from '../../../hooks/authUser';
import Loader from '../../../components/app/Loader';
import {
  getUserSubscription,
  isUserContentSubscriber,
} from '../../../models/user';
import { generateQueryPath } from '../../../utils';
import routeConstants from '../../../utils/constants/routes';
import { handleGetUpsellPricing, setUTM } from '../../../store/slices/payment';
import { wrapper } from '../../../store';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import useTrackPageView from '../../../hooks/trackPageView';
import useExperiments from '../../../hooks/experiments';
import GroupJoinWaitList from '../../../components/page/upsell/GroupJoinWaitList';
import TopCoaches from '../../../components/page/upsell/TopCoaches';
import NewCoachingFlow from '../../../components/page/upsell/NewCoachingFlow';
import BookCall from '../../../components/page/upsell/BookCall';
import useBookableCoaches from '../../../hooks/bookableCoaches';
import { updateUserProfile } from '../../../store/slices/auth';
import { notifyHandledError } from '../../../services/ErrorMonitoring';

const screens = ['upsell'];
const EXPERIMENTS = [
  'webCoachingTextRemindersNoSkip',
  'webCoachingAddToCalendar',
  'countryBasedPricingUSD',
  'webYearlyPricing',
];

function Upsell() {
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const { user, authLoading, isLoading } = useAuthUser();
  const [experiments] = useExperiments(EXPERIMENTS, user);
  const { coaches } = useBookableCoaches(user ? {} : null);
  const [coachingSubscriptionDetails, setCoachingSubscriptionDetails] =
    useState(null);
  const { t } = useTranslations();

  const addScreen = (newScreen, { atScreen, atIndex, previousScreen } = {}) => {
    if (screens.includes(newScreen)) {
      return;
    }
    if (typeof atIndex === 'number') {
      screens.splice(atIndex, 0, newScreen);
    } else if (atScreen && screens.indexOf(atScreen) !== -1) {
      screens.splice(screens.indexOf(atScreen), 0, newScreen);
    } else if (previousScreen && screens.indexOf(previousScreen) !== -1) {
      screens.splice(screens.indexOf(previousScreen) + 1, 0, newScreen);
    } else {
      screens.push(newScreen);
    }
  };

  const removeScreen = (screen) => {
    if (screens.includes(screen)) {
      screens.splice(screens.indexOf(screen), 1);
    }
  };

  const {
    campaign = null,
    noTemporaryHold = null,
    source = null,
    utm_source = null,
    userId = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
    authAmount,
    discountedYearlyPricing,
    trial,
  } = usePageQuery({ fetchUserFromQuery: true });
  const { pricing } = useShallowEqualSelector(({ payment }) => payment);
  useCountyBasedPricing({ experiments, id: pricing?.id, isUpsell: true });
  const dispatch = useDispatch();
  const showWebNewCoachingFlow = 'b';

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
    if (webYearlyPriceVariant && user?.id && !user?.webYearlyPriceVariant) {
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
    user?.id,
    user?.webYearlyPriceVariant,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(
      setUTM({
        attribution: utm_source,
        campaign: utm_campaign || campaign,
        medium: utm_medium,
        content: utm_content,
      })
    );
  }, [
    campaign,
    dispatch,
    utm_campaign,
    utm_content,
    utm_medium,
    utm_source,
    pricing,
  ]);

  useEffect(() => {
    if (!user && !userId && !authLoading && !isLoading) {
      const path = generateQueryPath(routeConstants.PAGE_SIGNUP);
      Router.push(path);
    }
  }, [authLoading, user, isLoading, userId]);

  const { isDark } = useThemeListener();

  const onNext = (params) => {
    if (currentScreenIndex + 1 < screens.length) {
      setCurrentScreen(currentScreenIndex + 1);
    } else {
      const query = {
        userId: user && user.id,
        source,
        utm_campaign: utm_campaign || campaign,
        utm_source,
        noTemporaryHold,
        type: 'content',
        authAmount,
        trial,
      };
      if (params && params.coachId) {
        query.coachId = params.coachId;
        query.isCoachingFreeTrial = params.isCoachingFreeTrial;
        query.type = params.type;
      }
      if (coachingSubscriptionDetails) {
        query.coachId = coachingSubscriptionDetails.coachId;
        query.isCoachingFreeTrial =
          coachingSubscriptionDetails.isCoachingFreeTrial;
        query.type = coachingSubscriptionDetails.type;
      }

      if (trial) {
        query.trial = trial;
      }
      const redirectLink = generateQueryPath(
        routeConstants.PAGE_GET_APP,
        query
      );
      Router.push(redirectLink);
    }
  };
  useEffect(() => {
    if (isUserContentSubscriber(user) && currentScreenIndex === 0) {
      getUserSubscription(user.id)
        .then((subscription) => {
          if (subscription && subscription.familyPlan) {
            addScreen('shareSubscription');
            onNext();
          }
        })
        .catch((error) => {
          notifyHandledError(error, {
            message: 'Failed to get user subscription details',
          });
        });
    }
  }, [user, currentScreenIndex]);

  useTrackPageView({ PricingId: pricing?.id, PricingName: pricing?.name }, [
    pricing,
  ]);
  const checkHideBackgroundImages = useCallback(() => {
    if (currentScreenIndex > 0) {
      return true;
    }
    return false;
  }, [currentScreenIndex]);

  return (
    <BaseLayout
      useAuth
      isUserFromQuery={!!userId}
      hideBackground={true}
      isDarkMode={isDark}
      hideFooterBackground={true}
      hideBackgroundImages={checkHideBackgroundImages}>
      <Head>
        <title>{t('meta_upsell_title')}</title>
        <meta name="description" content={t('meta_upsell_description')} />
        <meta property="og:title" content={t('meta_upsell_title')} />
        <meta
          property="og:description"
          content={t('meta_upsell_description')}
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
      {!user ||
      !coaches ||
      (!experiments &&
        !experiments.webCoachingJoinWaitlist &&
        !experiments.newCoachingFlow &&
        !experiments.webFPPricing) ? (
        <Loader />
      ) : (
        <UpSellPageScreens
          screen={screens[currentScreenIndex]}
          user={user}
          onNext={onNext}
          onBack={() => {
            if (currentScreenIndex === 0) {
              window.history.go(-1);
            }
            setCurrentScreen(currentScreenIndex - 1);
            window.scrollTo(0, 0);
          }}
          experiments={experiments}
          coaches={coaches}
          coachingSubscriptionDetails={coachingSubscriptionDetails}
          setCoachingSubscriptionDetails={setCoachingSubscriptionDetails}
          addScreen={addScreen}
          removeScreen={removeScreen}
          isNewCoachingFlow={false}
          screens={screens}
          discountedYearlyPricing={discountedYearlyPricing}
        />
      )}
    </BaseLayout>
  );
}
function UpSellPageScreens({ screen, ...props }) {
  switch (screen) {
    case 'upsell':
      return <UpsellPage {...props} />;
    case 'joinGroupWaitList':
      return <GroupJoinWaitList {...props} />;
    case 'newCoachingFlow':
      return <NewCoachingFlow {...props} />;
    case 'topCoaches':
      return <TopCoaches {...props} />;
    case 'bookCall':
      return <BookCall {...props} />;
    case 'shareSubscription':
      return <ShareSubscription {...props} />;
    default:
      return null;
  }
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      const pricingDetails = await store
        .dispatch(handleGetUpsellPricing())
        .unwrap();
      return {
        props: {
          pricingDetails,
          ...(await I18N.loadLocale({ locale, route: '/subscribe/upsell' })),
        },
      };
    }
);

export default Upsell;
