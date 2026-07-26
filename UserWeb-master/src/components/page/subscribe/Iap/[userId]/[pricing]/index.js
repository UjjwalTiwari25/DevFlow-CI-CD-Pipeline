import React, { useCallback, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import SubscribeCard from '@/components/payment/Iap/SubscribeCard';
import Stripe from '@/services/Stripe';
import { generateQueryPath } from '@/utils';
import routeConstants from '@/utils/constants/routes';
import usePageQuery from '@/hooks/pageQuery';
import { getAuthorizationAmount, getTrialFee } from '@/models/payment';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import { handleUpdatePixelCookies } from '@/store/slices/auth';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import Loader from '@/components/app/Loader';
import { setTrialFee } from '@/store/slices/payment';
import styles from './style.module.scss';

const Iap = ({ pricing, user }) => {
  const dispatch = useDispatch();
  const { trialFee } = useShallowEqualSelector(({ payment }) => payment);
  const {
    campaign = null,
    utm_source = null,
    utm_campaign = null,
    challengeId,
    trackId,
    liveEventId,
    playlistId,
    playlistOwnerId,
  } = usePageQuery();

  // Automatically set trial fee if pricing has it configured
  useEffect(() => {
    if (pricing) {
      if (pricing.trial === 0) {
        dispatch(setTrialFee(0));
      } else {
        const fee = getTrialFee(pricing);
        if (fee) {
          dispatch(setTrialFee(fee * 100)); // Convert to cents for consistency
        } else {
          dispatch(setTrialFee(0));
        }
      }
    }
  }, [dispatch, pricing]);

  const onSuccessfulSubscription = useCallback(
    async (paymentMethodType) => {
      const userID = user?.id;
      const path = generateQueryPath(
        `${routeConstants.PAGE_SUBSCRIBE}/${routeConstants.PAGE_IAP}/${routeConstants.PAGE_SUCCESS}`,
        {
          userId: userID,
          source: routeConstants.PAGE_IAP,
          utm_campaign: utm_campaign || campaign,
          utm_source,
          authAmount: await getAuthorizationAmount(),
          challengeId,
          trackId,
          liveEventId,
          paymentMethodType,
          playlistId,
          playlistOwnerId,
          trialFee,
        }
      );
      await dispatch(handleUpdatePixelCookies(userID));
      Router.push(path);
    },
    [
      user?.id,
      dispatch,
      utm_campaign,
      campaign,
      utm_source,
      challengeId,
      trackId,
      liveEventId,
      playlistId,
      playlistOwnerId,
      trialFee,
    ]
  );

  if (!pricing) return <Loader />;
  return (
    <div className={styles.container}>
      <Elements stripe={Stripe.instance}>
        <SubscribeCard
          pricing={pricing}
          user={user}
          onSuccessfulSubscription={onSuccessfulSubscription}
        />
      </Elements>
    </div>
  );
};

export default Iap;
