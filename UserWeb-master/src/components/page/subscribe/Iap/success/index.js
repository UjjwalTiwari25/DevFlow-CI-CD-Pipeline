import React, { useCallback, useEffect, useState } from 'react';
import Text from '@/components/app/Text';
import useTranslations from '@/hooks/translations';
import useAuthUser from '@/hooks/authUser';
import usePageQuery from '@/hooks/pageQuery';
import Analytics from '@/services/Analytics';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import config from '@/config';
import styles from './style.module.scss';

const INITIAL_COUNTDOWN = 4;

const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(INITIAL_COUNTDOWN);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const { t } = useTranslations();
  const { subscription } = useShallowEqualSelector((state) => state.payment);
  const { user } = useAuthUser();
  const userName = user?.givenName || 'Aura';
  const {
    challengeId,
    trackId,
    liveEventId,
    playlistId,
    source,
    utm_source = null,
    utm_campaign = null,
    referralCode = null,
    referralType = null,
  } = usePageQuery();

  const getAnalyticsData = useCallback(() => {
    return {
      UserID: user && user.id,
      Email: user && user.email,
      SentFrom: source,
      attribution: utm_source,
      campaign: utm_campaign,
      ChallengeId: challengeId,
      LiveEventId: liveEventId,
      PlaylistId: playlistId,
      TrackId: trackId,
      ReferralCode: referralCode,
      ReferralType: referralType,
      'Redirected From': 'Web Subscription Modal',
      'Redirected To': 'App Subscription Modal',
    };
  }, [
    source,
    user,
    utm_source,
    utm_campaign,
    challengeId,
    liveEventId,
    playlistId,
    trackId,
    referralCode,
    referralType,
  ]);

  const handleTakeToApp = useCallback(() => {
    if (subscription?.id) {
      Analytics.track('User Redirected', getAnalyticsData());
      if (window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'payment_success',
            subscriptionId: subscription.id,
          })
        );
      } else {
        const deeplinkUrl = `${config.appDomainProd}/deeplink/destination/iap-success/objectId/${subscription.id}`;
        window.location.href = deeplinkUrl;
      }
    }
  }, [subscription, getAnalyticsData]);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (autoRedirect && countdown === 0) {
      handleTakeToApp();
      setAutoRedirect(false);
    }
    return undefined;
  }, [countdown, handleTakeToApp, autoRedirect]);

  const angle = (countdown / INITIAL_COUNTDOWN) * 360;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <img
              className={styles.auraLogo}
              src={'/static/images/aura-ring.png'}
              alt="Aura Logo"
            />
          </div>
          <Text
            variant={'h2-small'}
            weight={'semibold'}
            style={{
              color: '#2F3237',
              fontSize: '28px',
              marginBottom: '20px',
            }}>
            {t('success_welcome', { userName })}
          </Text>
          <Text variant={'body'} style={{ color: '#2F3237' }}>
            {t('success_subscription_active')}
          </Text>
        </div>
        <div className={styles.countdownContainer}>
          {autoRedirect ? (
            <div className={styles.countdownContainer}>
              <div
                style={{
                  border: '2px solid rgba(17, 25, 30, 0.08)',
                  borderRadius: '50px',
                  width: '48px',
                  height: '48px',
                  marginBottom: '20px',
                }}>
                <div
                  className={styles.countdownCircle}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50px',
                    background: `conic-gradient(#4CCAFF ${angle}deg, #F5EEEA ${angle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '5px',
                    transform: 'scaleX(-1)',
                  }}>
                  <div
                    style={{
                      backgroundColor: '#F5EEEA',
                      borderRadius: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      transform: 'scaleX(-1)',
                    }}>
                    <span className={styles.countdownNumber}>{countdown}</span>
                  </div>
                </div>
              </div>
              <Text variant={'body3'} style={{ color: '#5B657A' }}>
                {t('success_sending_to_app')}
              </Text>
            </div>
          ) : (
            <>
              <button
                className={styles.takeToAppButton}
                onClick={handleTakeToApp}>
                {t('success_take_me_to_aura')}
              </button>
              <Text variant={'body3'} style={{ color: '#5B657A' }}>
                {t('success_not_redirected')}
              </Text>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
