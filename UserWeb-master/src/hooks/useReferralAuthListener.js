import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Router from 'next/router';

import Analytics from '@/services/Analytics';
import Logger from '@/services/Logger';
import LocalStorage from '@/services/LocalStorage';
import IPLookup from '@/services/IPLookup';
import Auth from '@/services/Auth';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import routeConstants from '@/utils/constants/routes';
import referralConstants from '@/utils/constants/referral';
import { generateQueryPath } from '@/utils';
import appConstants from '@/utils/constants/app';
import { createUserProfileFromAuth } from '@/models/user';
import {
  handleSetUser,
  updateUserProfile,
  handleLogout,
} from '@/store/slices/auth';
import { reserveSpot } from '@/store/slices/live';
import pricingConstants from '@/utils/constants/pricing';
import useShallowEqualSelector from './shallowEqualSelector';
import useLatestValue from './latestValue';
import useHydration from './hydration';
import usePageQuery from './pageQuery';
import {
  FIREBASE_ATTRIBUTION_PROPERTIES,
  TRACKED_PARAMS,
} from './trackAttribution';

const {
  REFER_CODE_AURA_SOCIAL,
  SOURCE_GUEST_PASS_REFERRAL,
  SOURCE_INFLUENCER_REFERRAL,
} = referralConstants;
const { PRICING_DEFAULT, PRICING_REFERRAL, PRICING_YEARLY_6999_7DAYS_25OFF } =
  pricingConstants;
const { PAGE_SIGNUP, PAGE_GET_APP, PAGE_SUBSCRIBE } = routeConstants;

function useReferralAuthListener({
  utm_campaign,
  utm_source,
  utm_medium,
  referralType,
  referralCode,
  referrer,
  experiments,
  playlistId,
  playlistOwnerId,
  playlistName,
  type,
} = {}) {
  const dispatch = useDispatch();
  const profile = useShallowEqualSelector((state) => state.onboard.profile);
  const profileRef = useLatestValue(profile);
  const isClient = useHydration();
  const pageQuery = usePageQuery();

  const {
    redirectTo = null,
    utm_content = null,
    challengeId,
    trackId,
    liveEventId,
  } = pageQuery;

  const onAuthChange = useCallback(
    async (auth) => {
      Analytics.sendDebugEvent(
        'Referral Landing Page Signup auth change callback',
        { auth, referralType }
      );
      if (auth.isLoggedIn) {
        Analytics.initMixpanel();
        const profileData = { ...profileRef.current };
        if (auth.isNewUser) {
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
              pageQuery[utmKey] ||
              LocalStorage.getItem(TRACKED_PARAMS[utmKey]) ||
              null;
            const propertyName = FIREBASE_ATTRIBUTION_PROPERTIES[utmKey];

            acc[propertyName] = value;

            return acc;
          }, {});
          profileData.attributionData = {
            ...profileData.attributionData,
            ...updatedAttributionData,
            sourcePlatform: appConstants.APP_NAME,
            challengeId: challengeId || null,
            trackId: trackId || null,
            liveEventId: liveEventId || null,
            playlistId: playlistId || null,
            playlistName: playlistName || null,
            referralCode:
              referralCode && referralCode !== REFER_CODE_AURA_SOCIAL
                ? referralCode
                : null,
            referralType:
              referralType && referralCode !== REFER_CODE_AURA_SOCIAL
                ? referralType
                : null,
            referrerId: referrer?.id || null,
            installSource: utm_source || null,
          };

          profileData.experiments = {
            ...profileData.experiments,
            ...experiments,
          };

          fbProfile = { ...fbProfile, ...profileData };
          Logger.debug('New user, creating profile', { fbProfile });

          try {
            Analytics.sendDebugEvent(
              'Referral Landing Page Signup auth listener - setting user data',
              { id: auth.data.id, token: Auth.getUserAuthToken(), referralType }
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
              flow: 'referral',
              errorCode,
            });
            await dispatch(handleLogout());
            return;
          }
        }
        Logger.debug('User logged in, redirecting');
        Analytics.identifyUser(auth.user);
        Analytics.track('Login', {
          Time: new Date().toTimeString().slice(0, 2),
          Day: new Date().getDay(),
        });
        await dispatch(
          updateUserProfile({
            profile: {
              challengeInvited: challengeId ? true : null,
              contentInvited: trackId ? true : null,
              liveEventInvited: liveEventId ? true : null,
              playlistInvited: playlistId ? true : null,
            },
            id: auth.user?.id || auth.data?.uid,
            saveToDatabase: true,
          })
        );
        if (liveEventId) {
          await dispatch(reserveSpot({ liveEventId }));
        }
        Analytics.setPeopleProperties({
          'Challenge Invited': !!challengeId,
          'Content Invited': !!trackId,
          'Live Event Invited': !!liveEventId,
          Referrer:
            referralCode === REFER_CODE_AURA_SOCIAL
              ? REFER_CODE_AURA_SOCIAL
              : undefined,
        });
        Analytics.setSuperProperties({
          'Challenge Invited': !!challengeId,
          'Content Invited': !!trackId,
          'Live Event Invited': !!liveEventId,
          Referrer:
            referralCode === REFER_CODE_AURA_SOCIAL
              ? REFER_CODE_AURA_SOCIAL
              : undefined,
        });
        let path;
        let pricing;

        if (
          referralCode === REFER_CODE_AURA_SOCIAL &&
          type !== SOURCE_GUEST_PASS_REFERRAL
        ) {
          pricing = PRICING_DEFAULT;
        } else if (type === SOURCE_INFLUENCER_REFERRAL) {
          pricing = PRICING_YEARLY_6999_7DAYS_25OFF;
        } else {
          pricing = PRICING_REFERRAL;
        }

        if (auth.user?.premium) {
          path = generateQueryPath(PAGE_GET_APP, {
            source: PAGE_SUBSCRIBE,
            userId: auth.data.uid,
            utm_campaign,
            utm_source,
            noTemporaryHold: true,
            challengeId,
            trackId,
            liveEventId,
            playlistId,
            playlistOwnerId,
            referralCode:
              referralCode !== REFER_CODE_AURA_SOCIAL ? referralCode : null,
            referralType:
              referralCode !== REFER_CODE_AURA_SOCIAL ? referralType : null,
          });
        } else {
          path = generateQueryPath(`${PAGE_SUBSCRIBE}/${pricing}`, {
            utm_source,
            utm_campaign,
            redirectTo,
            sentFrom: PAGE_SIGNUP,
            utm_medium,
            utm_content,
            challengeId,
            trackId,
            liveEventId,
            playlistId,
            playlistOwnerId,
            isShareReferral: true,
            referralCode:
              referralCode !== REFER_CODE_AURA_SOCIAL ? referralCode : null,
            referralType:
              referralCode !== REFER_CODE_AURA_SOCIAL ? referralType : null,
            userId: auth.data.uid,
          });
        }
        Router.replace(path).then(() => {
          window.scrollTo(0, 0);
        });
      }
    },
    [
      referralType,
      profileRef,
      dispatch,
      challengeId,
      trackId,
      liveEventId,
      playlistId,
      referralCode,
      isClient,
      experiments,
      utm_source,
      pageQuery,
      utm_campaign,
      type,
      redirectTo,
      utm_medium,
      utm_content,
    ]
  );

  return onAuthChange;
}
export default useReferralAuthListener;
