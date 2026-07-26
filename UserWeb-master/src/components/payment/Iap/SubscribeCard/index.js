import React, { useEffect, useState } from 'react';
import AuraButton from '@/components/app/AuraButton';
import useTranslations from '@/hooks/translations';
import {
  getDiscountedPricing,
  getTrialFee,
  getPricingForDuration,
  getYearlyPricing,
} from '@/models/payment';
import { Trans } from 'react-i18next';
import { useStripe } from '@stripe/react-stripe-js';
import useStripeCard from '@/hooks/stripeCard';
import useHydration from '@/hooks/hydration';
import Analytics from '@/services/Analytics';
import usePageQuery from '@/hooks/pageQuery';
import { setUTM } from '@/store/slices/payment';
import { useDispatch } from 'react-redux';
import Text from '@/components/app/Text';
import classNames from 'classnames';
import CardInput from '../../clean/CardInput';
import styles from './styles.module.scss';
import ApplePayButton from '../../ApplePayButton';

const SubscribeCard = ({ pricing, user, onSuccessfulSubscription }) => {
  const [activeTab, setActiveTab] = useState('apple');
  const stripe = useStripe();
  const { t } = useTranslations();
  const isClient = useHydration();
  const dispatch = useDispatch();
  const {
    handlePaymentRequestSubmit,
    handleSubmit,
    applePay,
    canShowPaymentRequest,
    paymentRequest,
    loading,
  } = useStripeCard({
    showQuickCheckout: true,
    onSuccessfulSubscription,
    user,
    pricing,
    stripe,
  });
  const {
    a_cid: papCampaignId = null,
    campaign = null,
    pap_trial_action: papTrialAction = null,
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
  } = usePageQuery();
  const showPaymentRequestButton = canShowPaymentRequest && paymentRequest;

  const showApplePayButton = showPaymentRequestButton && applePay;
  useEffect(() => {
    if (showApplePayButton) {
      Analytics.setPeopleProperties({
        'Apple Pay': true,
      });
    }
  }, [showApplePayButton]);

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
  // Handler for tab switching
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  if (!isClient) return null;
  return (
    <div className={styles.container}>
      <div className={styles.bgGradient}></div>
      <div className={styles.content}>
        {showApplePayButton && (
          <Text type="h3-small" color="b100" weight="semibold">
            {t('payment_subscribe_choose_payment_method')}
          </Text>
        )}

        <div className={styles.paymentContainer}>
          {/* Payment method tabs */}
          {showApplePayButton && (
            <div className={styles.tabContainer}>
              <div
                className={classNames(styles.tab, {
                  [styles.activeTab]: activeTab === 'apple',
                })}
                onClick={() => handleTabClick('apple')}>
                <span className={styles.applePayLabel}>Apple Pay</span>
                <img
                  src="/static/images/apple-pay-black.png"
                  alt="Apple Pay"
                  className={styles.applePayLogo}
                />
              </div>
              <div
                className={classNames(styles.tab, {
                  [styles.activeTab]: activeTab === 'card',
                })}
                onClick={() => handleTabClick('card')}>
                <span className={styles.cardLabel}>Card</span>
                <img
                  src="/static/images/credit-card.png"
                  alt="Credit Card"
                  className={styles.cardIcon}
                />
              </div>
            </div>
          )}

          {/* Payment form content */}
          <div className={styles.formContent}>
            <div className={styles.cardContent}>
              <div className={styles.pricingInfo}>
                {pricing.trial === 0 ? (
                  <Text type="h3-small" color="b100" weight="semibold">
                    {t(pricing.title, {
                      fee: pricing.discountedPricing,
                    })}
                  </Text>
                ) : (
                  <Text type="h3-small" color="b100" weight="semibold">
                    {pricing.trialFee
                      ? t(`payment_subscribe_total_due_today`, {
                          fee: pricing.trialFee,
                        })
                      : t(pricing.title, {
                          fee: '$0.00',
                        })}
                  </Text>
                )}
                <Text
                  type="footnote"
                  color="b100"
                  weight="regular"
                  style={{
                    color: '#5B657A',
                  }}>
                  {t(pricing.checkoutDescriptionIap, {
                    count: pricing.trial,
                    yearlyPricing: getDiscountedPricing(pricing),
                    monthlyPricing: getPricingForDuration(pricing),
                    weeklyPricing: getPricingForDuration(pricing, 'weekly'),
                    trialFee: getTrialFee(pricing),
                  })}
                </Text>
              </div>
              {/* Best of Apple badge */}
              <div className={styles.appleLogoContainer}>
                <img
                  src="/static/images/best-of-apple.svg"
                  alt="Best of Apple"
                  className={styles.bestOfAppleImage}
                />
              </div>

              {/* Card input form */}
              <form onSubmit={handleSubmit} className={styles.cardForm}>
                {activeTab === 'apple' && showApplePayButton ? (
                  <ApplePayButton
                    title="Pay with"
                    onClick={handlePaymentRequestSubmit}
                    disabled={loading}
                    appleColor="#fff"
                    style={{
                      backgroundColor: '#000',
                      color: '#fff',
                      marginBottom: 0,
                    }}
                  />
                ) : (
                  <>
                    <CardInput autoFocus />
                    <AuraButton
                      blinking
                      title={
                        pricing.trial !== 0 && !pricing.trialFee
                          ? t(pricing.checkout)
                          : t(pricing.checkoutIap)
                      }
                      loading={loading}
                      style={{
                        minWidth: 230,
                        height: 56,
                        borderRadius: 100,
                        color: '#fff',
                        background:
                          'linear-gradient(46.17deg, #4CCAFF 0%, #1DF5ED 102.13%)',
                        boxShadow: '0px 8px 32px 2px #38DAF74D',
                      }}
                      textWeight={'bold'}
                    />
                  </>
                )}
              </form>

              {/* Terms text */}
              <div>
                <Text
                  type="footnote"
                  color="b100"
                  weight="regular"
                  style={{
                    color: '#9092A3',
                  }}>
                  <Trans
                    ns="subscribe"
                    i18nKey={pricing.descriptionIap}
                    values={{
                      yearlyPricing: getYearlyPricing(pricing),
                      monthlyPricing: getPricingForDuration(pricing),
                      discountedPricing: getDiscountedPricing(pricing),
                    }}
                    components={[
                      <span
                        key="moneyBackGuarantee"
                        className="bold"
                        style={{
                          fontWeight: '700',
                          color: '#5B657A',
                        }}></span>,
                    ]}
                  />
                </Text>
              </div>
              {(activeTab !== 'apple' || !showApplePayButton) && (
                <div className={styles.stripeSecure}>
                  <img
                    src="/static/images/stripe/powered-by-stripe-exp.png"
                    alt="Stripe Secure"
                    className={styles.stripeSecureImage}
                  />
                  <img
                    src="/static/images/stripe/secured-exp.png"
                    alt="Stripe Secure"
                    className={styles.stripeSecureImage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeCard;
