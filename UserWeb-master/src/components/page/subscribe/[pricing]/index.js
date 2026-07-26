import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import classNames from 'classnames';
import { AiOutlineClose } from 'react-icons/ai';
import { handleUpdatePixelCookies } from '@/store/slices/auth';
import pricingConstants from '@/utils/constants/pricing';
import referralConstants from '@/utils/constants/referral';
import FollowUpDiscount from '@/components/payment/clean/FollowUpDiscount';
import Link from 'next/link';
import usePageQuery from '../../../../hooks/pageQuery';
import Analytics from '../../../../services/Analytics';
import { getPaywallAnalyticsProperties } from '../../../../utils/paywallAnalytics';
import routeConstants from '../../../../utils/constants/routes';
import SubscribeClean from '../../../payment/clean/SubscribeClean';
import styles, { closeButtonStyles } from './styles';
import { generateQueryPath } from '../../../../utils';
import {
  setPromoCode,
  setReferrer,
  setTrialFee,
  setUTM,
  handleGetPricing,
} from '../../../../store/slices/payment';
import useReferral from '../../../../hooks/referral';
import Loader from '../../../app/Loader';
import useBrowserHistory from '../../../../hooks/browserHistory';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import useThemeListener from '../../../../hooks/themeListener';
import {
  getAuthorizationAmount,
  getDiscountedPricing,
} from '../../../../models/payment';

export default function SubscribePricing({
  promoErrorMessage,
  promoHideMessage,
  promo,
  fee,
  onBack,
  onNext,
  user,
  experiments,
  setTotalPrice,
  showFollowUpDiscount,
  setShowFollowUpDiscount,
  isShareReferral,
  purchaseModalRef,
}) {
  useBrowserHistory('subscribePricing', !!setTotalPrice, onBack, onNext);

  const {
    pricing: pricingId,
    a_cid: papCampaignId = null,
    campaign = null,
    pap_trial_action: papTrialAction = null,
    utm_source = null,
    userId = null,
    utm_campaign = null,
    redirectTo = null,
    referralCode = null,
    referralType = null,
    sentFrom = null,
    utm_medium = null,
    utm_content = null,
    challengeId,
    trackId,
    liveEventId,
    playlistId,
    playlistOwnerId,
  } = usePageQuery({ fetchUserFromQuery: true });
  const { isDark } = useThemeListener();
  const [showCloseIcon, setShowCloseIcon] = useState(false);
  const [showNotNow, setShowNotNow] = useState(false);
  const { referrer, loading } = useReferral(referralCode, referralType);
  const dispatch = useDispatch();
  const {
    pricing,
    coach,
    isCoaching,
    isCelebrity,
    currentPricingCountryCode,
    trialFee,
  } = useShallowEqualSelector(({ payment }) => payment);

  const isInfluencerReferral =
    referralType ===
      referralConstants.TYPE_INFLUENCER_SUBSCRIPTION_25OFF_7TRIAL &&
    referrer?.role === 'influencer';

  const isWebFollowUpOfferScrAfterClose =
    pricing.id === pricingConstants.PRICING_DEFAULT;
  useEffect(() => {
    dispatch(setReferrer(referrer));
  }, [dispatch, referrer, referralType]);

  useEffect(() => {
    if (showFollowUpDiscount) return;
    if (pricing.trial === 0) {
      dispatch(setTrialFee(0));
    } else {
      dispatch(setTrialFee(parseFloat(fee) * 100));
    }
  }, [fee, dispatch, pricing.trial, showFollowUpDiscount]);

  useEffect(() => {
    dispatch(setPromoCode(promo));
  }, [promo, dispatch, pricing.id]);

  useEffect(() => {
    dispatch(
      setUTM({
        attribution: utm_source,
        campaign: utm_campaign || campaign,
        medium: utm_medium,
        content: utm_content,
        papCampaignId,
        papTrialAction,
      })
    );
  }, [
    campaign,
    dispatch,
    utm_campaign,
    utm_content,
    utm_medium,
    utm_source,
    pricing.id,
    papCampaignId,
    papTrialAction,
  ]);

  useEffect(() => {
    if (
      // When user comes from sign up page
      (user &&
        sentFrom === routeConstants.PAGE_SIGNUP &&
        !referrer &&
        !isCelebrity &&
        !isCoaching &&
        !isShareReferral &&
        fee === '0' &&
        !promo &&
        !loading) ||
      // When user comes from any page other than signup, check if redirect link is set
      (redirectTo && sentFrom !== routeConstants.PAGE_SIGNUP)
    ) {
      setShowNotNow(true);
      setTimeout(() => {
        setShowCloseIcon(true);
      }, 3000);
    }
  }, [
    user,
    sentFrom,
    referrer,
    loading,
    isCelebrity,
    promo,
    fee,
    isCoaching,
    isShareReferral,
    redirectTo,
  ]);

  const closeRedirectLink = useMemo(() => {
    let redirectLink = redirectTo;
    if (sentFrom === routeConstants.PAGE_SIGNUP) {
      redirectLink = generateQueryPath(routeConstants.PAGE_GET_APP, {
        userId: user && user.id,
        source: routeConstants.PAGE_SIGNUP,
        utm_campaign: utm_campaign || campaign,
        utm_source,
        noTemporaryHold: true,
      });
    }
    if (!redirectLink) {
      redirectLink = `/${routeConstants.PAGE_AURA}`;
    }
    return redirectLink;
  }, [redirectTo, sentFrom, user, utm_campaign, campaign, utm_source]);

  const redirectToFollowUpDiscountOffer = useCallback(() => {
    dispatch(
      handleGetPricing({
        id: pricingConstants.PRICING_YEARLY_5999_7DAYS_FOLLOW_UP,
      })
    );

    setShowFollowUpDiscount(true);
    dispatch(setTrialFee(null));
  }, [dispatch, setShowFollowUpDiscount]);

  const redirectToSubscribe = useCallback(() => {
    if (showFollowUpDiscount) {
      dispatch(
        handleGetPricing({
          id: pricingId,
        })
      );

      setShowFollowUpDiscount(false);
      dispatch(setTrialFee(0));
    }
  }, [showFollowUpDiscount, dispatch, pricingId, setShowFollowUpDiscount]);

  const onSuccessfulSubscription = useCallback(
    async (paymentMethodType) => {
      const userID = user?.id;
      let path = redirectTo;
      if (
        sentFrom === routeConstants.PAGE_SIGNUP &&
        !showFollowUpDiscount &&
        !referrer &&
        !isCoaching &&
        !isShareReferral &&
        ((currentPricingCountryCode !== 'IN' &&
          (pricing.trial === 7 || pricing.trial === 30)) ||
          (experiments?.threeSKUsV2 === 'a' &&
            pricing.id === pricingConstants.PRICING_YEARLY_6999_7DAYS_SKU_EXP))
      ) {
        path = generateQueryPath(
          `${routeConstants.PAGE_SUBSCRIBE}/${routeConstants.PAGE_UPSELL}`,
          {
            coachId: isCoaching && coach?.id,
            userId: userID,
            source: routeConstants.PAGE_SUBSCRIBE,
            utm_campaign: utm_campaign || campaign,
            utm_source,
            referralCode: referrer && referralCode,
            referralType: referrer && referralType,
            noTemporaryHold: !pricing.trial,
            authAmount: await getAuthorizationAmount(),
            trial: pricing.trial,
            discountedYearlyPricing: getDiscountedPricing(pricing),
          }
        );
      } else if (redirectTo === null) {
        path = generateQueryPath(routeConstants.PAGE_GET_APP, {
          coachId: isCoaching && coach?.id,
          userId: userID,
          source: routeConstants.PAGE_SUBSCRIBE,
          utm_campaign: utm_campaign || campaign,
          utm_source,
          referralCode: referrer && referralCode,
          referralType: referrer && referralType,
          noTemporaryHold: !pricing.trial,
          authAmount: await getAuthorizationAmount(),
          trial: pricing.trial,
          challengeId,
          trackId,
          liveEventId,
          paymentMethodType,
          playlistId,
          playlistOwnerId,
          trialFee,
        });
      }
      await dispatch(handleUpdatePixelCookies(userID));
      Router.push(path);
    },
    [
      user?.id,
      redirectTo,
      sentFrom,
      showFollowUpDiscount,
      referrer,
      isCoaching,
      isShareReferral,
      pricing,
      dispatch,
      coach?.id,
      utm_campaign,
      campaign,
      utm_source,
      referralCode,
      referralType,
      challengeId,
      trackId,
      liveEventId,
      playlistId,
      playlistOwnerId,
      trialFee,
    ]
  );

  function renderCloseButton() {
    if (!showCloseIcon) {
      return null;
    }
    return (
      <>
        {isWebFollowUpOfferScrAfterClose ? (
          <div
            className={classNames('close-button clickable', {
              'light-button': !isDark,
              'gray-button ': isDark,
            })}
            onClick={() => {
              Analytics.track('Web Subscription Close', {
                sentFrom,
                redirectTo,
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
                ...getPaywallAnalyticsProperties({ redirectedFromApp: false }),
              });
              redirectToFollowUpDiscountOffer();
            }}>
            <AiOutlineClose />
          </div>
        ) : (
          <Link href={closeRedirectLink} legacyBehavior>
            <a
              className={classNames('close-button clickable', {
                'light-button': !isDark,
                'gray-button ': isDark,
              })}
              onClick={() => {
                Analytics.track('Web Subscription Close', {
                  sentFrom,
                  redirectTo,
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
                  ...getPaywallAnalyticsProperties({
                    redirectedFromApp: false,
                  }),
                });
              }}>
              <AiOutlineClose />
            </a>
          </Link>
        )}
        <style jsx>{closeButtonStyles}</style>
      </>
    );
  }

  if (!Object.values(experiments).length) return <Loader />;

  return (
    <div className="container content-padding">
      {showFollowUpDiscount ? (
        <FollowUpDiscount
          onSuccessfulSubscription={onSuccessfulSubscription}
          experiments={experiments}
          user={user}
          onBack={onBack}
          redirectToSubscribe={redirectToSubscribe}
        />
      ) : (
        <SubscribeClean
          setTotalPrice={setTotalPrice}
          fee={fee}
          promo={promo}
          promoErrorMessage={promoErrorMessage}
          promoHideMessage={promoHideMessage}
          onSuccessfulSubscription={onSuccessfulSubscription}
          renderClose={renderCloseButton}
          experiments={experiments}
          user={user}
          onBack={onBack}
          isInfluencerReferral={isInfluencerReferral}
          purchaseModalRef={purchaseModalRef}
          isShareReferral={isShareReferral}
          redirectToFollowUpDiscountOffer={redirectToFollowUpDiscountOffer}
          showNotNow={showNotNow}
        />
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
