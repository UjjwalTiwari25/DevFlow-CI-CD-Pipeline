import { useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setReferrer } from '@/store/slices/payment';
import { createUserProfileFromAuth } from '../models/user';
import Analytics from '../services/Analytics';
import { notifyHandledError } from '../services/ErrorMonitoring';
import IPLookup from '../services/IPLookup';
import Logger from '../services/Logger';
import {
  handleSetUser,
  updateUserProfile,
  handleLogout,
} from '../store/slices/auth';
import { isClient } from '../utils';
import usePageQuery from './pageQuery';
import useReferral from './referral';

export default function useCoachProfileSignup(coach, attributionData) {
  const { referralCode, referralType, slugCommunity, slugCourse, slugEvent } =
    usePageQuery();

  const isCommunityInvited = !!slugCommunity || !!slugCourse || !!slugEvent;

  const { referrer } = useReferral(referralCode, referralType);

  const dispatch = useDispatch();
  const givenName = useRef('');
  const onAuthChange = useCallback(
    async (auth) => {
      if (auth.isLoggedIn) {
        Analytics.initMixpanel();
        let profileData = {};

        if (auth.isNewUser) {
          let fbProfile = createUserProfileFromAuth(auth.data);
          // Save user IP and userAgent to profile (required for facebook server events)
          profileData.ip = await IPLookup.getUserIPAddress();
          if (isClient()) {
            if (
              window.navigator &&
              window.navigator.userAgent &&
              window.navigator.userAgent.length
            ) {
              profileData.userAgent = window.navigator.userAgent;
            }
          }
          profileData.givenName = givenName.current;
          profileData.attributionData = { ...attributionData };
          if (coach && coach.id) {
            profileData.attributionData.coachId = coach.id;
          }
          if (referrer) {
            profileData.attributionData.referrerId = referrer.id;
            profileData.attributionData.referralCode = referrer.referralCode;
            profileData.attributionData.referralType = referrer.referralType;

            await dispatch(setReferrer(referrer));
          }
          fbProfile = { ...fbProfile, ...profileData };
          Logger.debug('New user, creating profile', { fbProfile });
          try {
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
              message: 'Failed to set user for coach profile signup',
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
              flow: 'coach-profile',
              errorCode,
            });
            await dispatch(handleLogout());
            return;
          }
        } else if (auth.user) {
          // Do not update attribution data for login
          profileData.attributionData = auth.user.attributionData;
        }
        profileData = { ...auth.user, profileData };
        Logger.debug('User logged in, redirecting');
        Analytics.identifyUser(auth.user);
        Analytics.track('Login', {
          Time: new Date().toTimeString().slice(0, 2),
          Day: new Date().getDay(),
        });
        if (isCommunityInvited) {
          await dispatch(
            updateUserProfile({
              profile: {
                communityInvited: isCommunityInvited,
              },
              id: auth.user?.id || auth.data?.uid,
              saveToDatabase: true,
            })
          );
          Analytics.setPeopleProperties({
            'Community Invited': isCommunityInvited,
          });
          Analytics.setSuperProperties({
            'Community Invited': isCommunityInvited,
          });
        }
      }
    },
    [coach, dispatch, isCommunityInvited, referrer]
  );
  const onSubmitSignup = useCallback((data) => {
    givenName.current = data.givenName;
  }, []);
  return { onAuthChange, onSubmitSignup };
}
