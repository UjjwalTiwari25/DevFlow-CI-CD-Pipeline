import React, { useCallback, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import config from '@/config';
import useTheme, { THEMES } from '@/hooks/theme';
import pricingConstants from '@/utils/constants/pricing';
import { getCelebrityById, getIdBySlug } from '@/models/celebrities';
import Auth from '@/services/Auth';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { updateProfile } from '@/store/onboard/actions';
import BaseLayout from '../../layouts/BaseLayout';
import Analytics from '../../services/Analytics';
import useShallowEqualSelector from '../../hooks/shallowEqualSelector';
import {
  createUserProfileFromAuth,
  followUser,
  getUserSubscription,
  isUserContentSubscriber,
} from '../../models/user';
import {
  handleLogout,
  handleSetUser,
  updateUserProfile,
} from '../../store/slices/auth';
import Logger from '../../services/Logger';
import useLatestValue from '../../hooks/latestValue';
import usePageQuery from '../../hooks/pageQuery';
import routeConstants from '../../utils/constants/routes';
import { generateQueryPath } from '../../utils';
import useExperiments from '../../hooks/experiments';
import LocalStorage from '../../services/LocalStorage';
import IPLookup from '../../services/IPLookup';
import useReferral from '../../hooks/referral';
import useToastMessage from '../../hooks/toastMessage';
import referralConstants from '../../utils/constants/referral';
import {
  FIREBASE_ATTRIBUTION_PROPERTIES,
  getAttributionDataFromUTMs,
  TRACKED_PARAMS,
} from '../../hooks/trackAttribution';
import SignupPage from '../../components/page/signup';
import Loader from '../../components/app/Loader';
import useTrackPageView from '../../hooks/trackPageView';
import appConstants from '../../utils/constants/app';
import { getPricingIdForPromo } from '../../models/payment';
import useThemeListener from '../../hooks/themeListener';
import { getCoach } from '../../models/coach';
import TiktokPixel from '../../services/TiktokPixel';
import { notifyHandledError } from '../../services/ErrorMonitoring';
import useBackEndExperiments from '../../hooks/backendExperiments';
import useHydration from '../../hooks/hydration';
import PostAffiliatePro from '../../services/PostAffiliatePro';
import Clarity from '../../services/Clarity';

const EXPERIMENTS = ['countryBasedPricingUSD'];

function Onboarding() {
  const dispatch = useDispatch();
  const profile = useShallowEqualSelector(({ onboard }) => onboard.profile);
  const pageQuery = usePageQuery();
  const [coachDetails, setCoachDetails] = useState(null);
  const [celebrity, setCelebrity] = useState();
  const [isPromoValid, setIsPromoValid] = useState(null);
  const isClient = useHydration();
  const { t, currentLocale } = useTranslations();
  const {
    a_aid: affiliateId,
    a_cid: affiliateCampaignId,
    pap_signup_action: papSignupAction,
    pap_trial_action: papTrialAction,
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    redirectTo = null,
    referralCode = null,
    referralType = null,
    source = null,
    promocode = null,
    coachId: utmCoachId = null,
    celeb_id: celebrityId = null,
    playlistId = null,
    playlistOwnerId = null,
    playlistName = null,
    noTrial3SKUs,
    threeSKUV2,
    utm_lp: utmLp,
    utm_assign_experiment: utmAssignExperiment,
    utm_assign_experiment_value: utmAssignExperimentValue,
  } = pageQuery;
  const { id: coachId = null, slug: slugCoach = null } = coachDetails || {};

  useTrackPageView();

  useEffect(() => {
    Clarity.initAndTrack();
  }, []);

  useEffect(() => {
    async function getCoachById() {
      const coach = await getCoach(utmCoachId);
      if (coach && coach.id) {
        setCoachDetails(coach);
      }
    }
    if (utmCoachId) {
      getCoachById();
    }
  }, [utmCoachId, utm_source]);

  useEffect(() => {
    async function validateCode(code) {
      const res = await getPricingIdForPromo(code);
      if (res) {
        setIsPromoValid(true);
      } else {
        setIsPromoValid(false);
      }
    }
    if (promocode) {
      validateCode(promocode);
    }
  }, [promocode]);

  if (
    noTrial3SKUs &&
    (noTrial3SKUs === true || noTrial3SKUs.toLowerCase() === 'true') &&
    !EXPERIMENTS.includes('noTrial3SKUs')
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

  if (
    utmLp &&
    utmLp === 'newAgeLP' &&
    !EXPERIMENTS.includes('ageQuestionShortLandingPage')
  ) {
    EXPERIMENTS.push('ageQuestionShortLandingPage');
  }

  const [experiments, experimentsLoading] = useExperiments(
    EXPERIMENTS,
    null,
    utm_source || 'organic' // Used for assigning targeted traffic experiments
  );

  const [backendExperiments] = useBackEndExperiments(
    null,
    utm_source || 'organic'
  );
  useTheme(coachId ? THEMES.LIGHT : THEMES.DARK);

  const { isDark } = useThemeListener();
  const Toast = useToastMessage();
  const profileRef = useLatestValue(profile);

  useEffect(() => {
    if (profileRef && profileRef.current) {
      const updates = {};

      if (
        !profileRef.current.experiments &&
        Object.keys(experiments).length > 0
      ) {
        updates.experiments = { ...experiments, ...backendExperiments };
      }

      if (!profileRef.current.showWebNewCoachingFlow) {
        updates.showWebNewCoachingFlow = 'b';
      }

      if (Object.keys(updates).length > 0) {
        dispatch(updateProfile(updates));
      }
    }
  }, [profileRef, experiments, backendExperiments, dispatch]);

  useEffect(() => {
    async function setCountryCode() {
      const location = await IPLookup.getUserGeoLocation();
      if (
        location &&
        location.countryCode &&
        location.countryCode.length === 2
      ) {
        dispatch(updateProfile({ countryCode: location.countryCode }));
      }
    }
    setCountryCode();
  }, [profileRef, dispatch]);

  useEffect(() => {
    if (
      currentLocale &&
      profileRef &&
      profileRef.current &&
      !profileRef.current.locale
    ) {
      dispatch(updateProfile({ locale: currentLocale }));
    }
  }, [currentLocale, profileRef, dispatch]);

  useEffect(() => {
    if (celebrityId && !celebrity) {
      const celebrityResponse = getCelebrityById(celebrityId);
      setCelebrity(celebrityResponse);
      const properties = {
        'Attribution Celebrity ID': celebrityId,
        'Attribution Celebrity Slug': celebrityResponse?.slug,
      };
      Analytics.setPeopleProperties(properties);
      Analytics.setSuperProperties(properties);
    }
  }, [celebrityId, celebrity]);

  const { referrer } = useReferral(referralCode, referralType);
  const isValidReferral = useCallback(
    async (user) => {
      if (!referrer || !user) {
        return true;
      }
      if (user.id === referrer.id) {
        Toast.showError(
          'Seems like you are trying to refer yourself. We are glad that you love Aura, but this only works if you invite new users.'
        );
        return false;
      }
      if (isUserContentSubscriber(user)) {
        Toast.showError('The referral guest pass is only for free users');
        return false;
      }
      if (user.referredBy) {
        Toast.showError('You have already used the referral guest pass once');
        return false;
      }
      const userSubscription = await getUserSubscription(user.id);
      if (userSubscription) {
        Toast.showError(
          'The referral discount is only for first time premium users.'
        );
        return false;
      }
      return true;
    },
    [Toast, referrer]
  );

  const onAuthChange = useCallback(
    async (auth) => {
      Analytics.sendDebugEvent('Signup auth change callback', auth);
      if (auth.isLoggedIn) {
        Analytics.initMixpanel();

        let profileData = { ...profileRef.current };
        if (experiments.countryBasedPricingUSD === 'a') {
          const location = await IPLookup.getUserGeoLocation();

          const { countryCode } = location || {};

          if (
            pricingConstants.COUNTRY_BASED_PRICING_ISO.includes(countryCode)
          ) {
            profileData.hasCountryBasedPricing = true;
          }
        }

        if (!profileData.recommendationPreference) {
          const profileLocal = LocalStorage.getItem('ONBOARDING_PROFILE');
          if (profileLocal && profileLocal.recommendationPreference) {
            profileData = profileLocal;
          }
        }
        if (auth.isNewUser) {
          profileData.showWebNewCoachingFlow = 'b';

          let fbProfile = createUserProfileFromAuth(auth.data);
          // Save user IP and userAgent to profile (required for facebook server events)
          profileData.ip = await IPLookup.getUserIPAddress();
          if (isClient) {
            if (
              window.navigator &&
              window.navigator.userAgent &&
              window.navigator.userAgent.length
            ) {
              profileData.userAgent = window.navigator.userAgent;
            }
          }

          const updatedAttributionData = Object.keys(
            FIREBASE_ATTRIBUTION_PROPERTIES
          ).reduce((acc, utmKey) => {
            const value =
              LocalStorage.getItem(TRACKED_PARAMS[utmKey]) ||
              pageQuery[utmKey] ||
              null;
            const propertyName = FIREBASE_ATTRIBUTION_PROPERTIES[utmKey];

            acc[propertyName] = value;

            return acc;
          }, {});
          profileData.attributionData = {
            ...profileData.attributionData,
            ...updatedAttributionData,
          };

          if (coachId) {
            profileData.attributionData.coachId = coachId;
          }
          if (referrer) {
            profileData.attributionData.referrerId = referrer.id;
            profileData.attributionData.referralCode = referrer.referralCode;
            profileData.attributionData.referralType = referrer.referralType;
          }
          if (promocode) {
            profileData.attributionData.promocode = promocode;
          }
          if (playlistId) {
            profileData.attributionData.playlistId = playlistId;
            profileData.playlistInvited = playlistId ? true : null;
          }
          if (playlistName) {
            profileData.attributionData.playlistName = playlistName;
          }
          if (celebrityId && celebrity) {
            profileData.celebrities = {
              [celebrityId]: true,
            };
            if (Array.isArray(celebrity.assignExpsOnSignup)) {
              celebrity.assignExpsOnSignup.forEach((exp) => {
                profileData.experiments = {
                  ...profileData.experiments,
                  [exp]: 'a',
                };
              });
            }
          }
          profileData.onboardingShown = {
            ...profileData.onboardingShown,
            webSignupOnboarding: true,
          };
          fbProfile = { ...fbProfile, ...profileData };
          Logger.debug('New user, creating profile', { fbProfile });

          if (utm_source === 'affiliate') {
            PostAffiliatePro.trackSignup({
              action: papSignupAction,
              campaignId: affiliateCampaignId,
              email: fbProfile.email,
              fname: fbProfile.givenName,
            });
          }

          try {
            Analytics.sendDebugEvent(
              'Signup auth listener - setting user data',
              { id: auth.data.id, token: Auth.getUserAuthToken() }
            );
            await dispatch(
              handleSetUser({ profile: fbProfile, id: auth.data.uid })
            ).unwrap();

            Logger.debug('FB profile created');
          } catch (err) {
            const { uid, email, providerData } = auth.data || {};
            const provider =
              providerData?.[0]?.providerId || fbProfile?.provider || null;
            const hadEmail = !!(fbProfile?.email || email);
            const errorCode = err?.errorCode || err?.code || null;
            const errorMessage = err?.errorMessage || err?.message || null;
            notifyHandledError(err, {
              message: 'Failed to set user for signup',
              uid,
              provider,
              hadEmail,
              providerCount: providerData?.length || 0,
              errorCode,
              errorMessage,
            });
            Analytics.track('Web Signup Orphan Prevented', {
              UserID: uid,
              Provider: provider,
              hadEmail,
              flow: 'web-signup',
              errorCode,
            });
            await dispatch(handleLogout());
            return;
          }
        } else if (referrer) {
          const isValid = await isValidReferral(auth.user);
          if (!isValid) {
            dispatch(handleLogout());
            return;
          }
        } else if (auth.user) {
          // Do not update attribution data for login
          delete profileData.attributionData;
          delete profileData.locale;
          profileData.onboardingShown = {
            ...(auth.user.onboardingShown || {}),
            ...(profileData.onboardingShown || {}),
          };
          // Add required data for 1-1 coaching to handle deep link
          if (coachId && utm_source === 'one-one-coaching') {
            profileData.attributionData = {
              ...(auth.user.attributionData || {}),
              installSource: 'one-one-coaching',
              coachId,
            };
            profileData.signUpSource = appConstants.APP_NAME;
          }
          // Update user profile based on answers chosen in onboarding
          await dispatch(
            updateUserProfile({
              profile: profileData,
              id: auth.user.id,
              saveToDatabase: true,
            })
          );
          profileData = { ...auth.user, profileData };
        }
        Logger.debug('User logged in, redirecting');
        Analytics.identifyUser(auth.user);
        Analytics.track('Login', {
          Time: new Date().toTimeString().slice(0, 2),
          Day: new Date().getDay(),
        });
        if (
          (referralType === referralConstants.COACH_SUBSCRIPTION_30TRIAL &&
            referrer) ||
          coachId
        ) {
          Logger.debug('Follow coach');
          await followUser(auth.data.uid, referrer?.id || coachId);
        }
        let path;
        if (coachId) {
          path = generateQueryPath(
            `${routeConstants.PAGE_COACHING_PLAN}/${slugCoach || coachId}`,
            {
              utm_source,
              utm_campaign,
              utm_medium,
              redirectTo,
              referralCode,
              referralType,
              sentFrom: routeConstants.PAGE_SIGNUP,
              promocode,
              utm_assign_experiment: utmAssignExperiment,
              utm_assign_experiment_value: utmAssignExperimentValue,
            }
          );
        } else {
          path = generateQueryPath(routeConstants.PAGE_YOUR_PLAN, {
            a_aid: affiliateId,
            a_cid: affiliateCampaignId,
            pap_signup_action: papSignupAction,
            pap_trial_action: papTrialAction,
            utm_source,
            utm_campaign,
            utm_medium,
            redirectTo,
            referralCode,
            referralType,
            sentFrom: routeConstants.PAGE_SIGNUP,
            promocode,
            celeb_id: celebrityId,
            playlistId,
            playlistOwnerId,
            noTrial3SKUs,
            threeSKUV2,
            utm_assign_experiment: utmAssignExperiment,
            utm_assign_experiment_value: utmAssignExperimentValue,
          });
        }
        // If celebrity onboarding and existing user, redirect to payment or aura page
        if (
          celebrityId &&
          celebrityId === getIdBySlug('greg-louganis') &&
          !auth.isNewUser &&
          auth.user
        ) {
          if (auth.user.premium) {
            path = `${routeConstants.PAGE_AURA}`;
          } else {
            path = `${config.api.auraWeb}/subscribe/celebrities/${celebrity.slug}?id=${auth.user.id}&utm_source=${appConstants.APP_NAME}`;
          }
        }

        if (!auth.isNewUser || !!coachId) {
          Router.replace(path).then(() => {
            window.scrollTo(0, 0);
          });
        }
      }
    },
    [
      profileRef,
      referrer,
      referralType,
      coachId,
      isClient,
      promocode,
      utm_source,
      source,
      pageQuery,
      dispatch,
      isValidReferral,
      slugCoach,
      utm_campaign,
      redirectTo,
      referralCode,
      celebrityId,
      celebrity,
      utmAssignExperiment,
      utmAssignExperimentValue,
    ]
  );
  useEffect(() => {
    Router.beforePopState(() => false);
    return () => {
      Router.beforePopState(() => true);
    };
  }, []);

  useEffect(() => {
    if (!pageQuery.isPageQueryLoading) {
      TiktokPixel.trackStandard('ViewContent', { content_id: 'signup' });
    }
  }, [pageQuery.isPageQueryLoading]);

  const signupStartFiredRef = useRef(false);
  useEffect(() => {
    if (signupStartFiredRef.current || pageQuery.isPageQueryLoading) {
      return;
    }
    signupStartFiredRef.current = true;
    Analytics.track('Sign up start', getAttributionDataFromUTMs(pageQuery));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageQuery.isPageQueryLoading]);

  useEffect(() => {
    if (utm_source === 'affiliate') {
      PostAffiliatePro.init();
    }
  }, [utm_source]);

  const isLegacyLoading =
    (coachId && !coachDetails) || !experiments || experimentsLoading;

  let body;
  if (isLegacyLoading) {
    body = <Loader />;
  } else {
    body = (
      <SignupPage
        experiments={experiments}
        profile={profile}
        profileRef={profileRef}
        referrer={referrer}
        dispatch={dispatch}
        isCoachingOnboarding={!!coachId}
        isPromoValid={isPromoValid}
        isCelebrityOnboarding={!!celebrity}
        celebrity={celebrity}
      />
    );
  }

  return (
    <BaseLayout
      useAuth
      allowSignup
      onAuthChange={onAuthChange}
      isDarkMode={isDark && !coachId}
      hideFooterBackground={experiments.ageQuestionShortLandingPage === 'a'}
      hideBackgroundImages={experiments.ageQuestionShortLandingPage === 'a'}>
      <Head>
        <title>{t('meta_signup_title')}</title>
        <meta name="description" content={t('meta_signup_description')} />
        <meta property="og:title" content={t('meta_signup_title')} />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:description"
          content={t('meta_signup_description')}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_SIGNUP}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {body}
    </BaseLayout>
  );
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await I18N.loadLocale({ locale, route: '/signup' })),
    },
  };
};

export default Onboarding;
