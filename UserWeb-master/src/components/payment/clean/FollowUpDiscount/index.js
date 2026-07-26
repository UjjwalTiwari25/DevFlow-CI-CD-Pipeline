import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useTranslations from '@/hooks/translations';
import { getDiscountedPricing, getYearlyPricing } from '@/models/payment';
import { Trans } from 'react-i18next';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import Loader from '../../../app/Loader';
import Text from '../../../app/Text';
import Stripe from '../../../../services/Stripe';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import styles from './styles';
import StripeCardFollowUp from '../StripCardFollowUp';

function FollowUpDiscount(props) {
  const [isFollowUp, setIsFollowUp] = useState(false);

  const { pricing, isProcessing: isPaymentProcessing } =
    useShallowEqualSelector(({ payment }) => payment);

  const {
    onSuccessfulSubscription,
    promoErrorMessage,
    promo,
    user,
    experiments,
  } = props;

  const { formatLocalPricing } = useConvertPriceInLocalCurrency({
    experiments,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [, isMobile] = useResponsiveWindow();
  const { t } = useTranslations();

  const CrossedText = ({ children }) => {
    return (
      <span>
        <img
          style={{ position: 'absolute' }}
          src="/static/images/cutting-line.png"
          alt="Crossed"
        />
        {children}
      </span>
    );
  };

  return (
    <div className="clean-subscribe relative">
      <div className="container">
        <div>
          <img src="/static/images/gift.png" alt="Gift Icon" />
        </div>
        <Text
          type="h3"
          component="h1"
          color="b100"
          align="center"
          style={{ fontSize: isMobile && '18px', whiteSpace: 'pre-wrap' }}>
          {t('payment_subscribe_follow_up_hinder_you')}
        </Text>

        <Text
          type="h2-smaller"
          component="h1"
          color="b100"
          align="center"
          style={{
            fontSize: '22px',
            background: 'linear-gradient(to right, #79EB33, #0BF066)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
            marginBottom: '2px',
            whiteSpace: 'pre-wrap',
          }}>
          <Trans
            ns="subscribe"
            i18nKey="payment_subscribe_follow_up_after_free_trial"
            values={{
              discountedPrice: formatLocalPricing(
                getDiscountedPricing(pricing)
              ),
              yearlyPricing: formatLocalPricing(getYearlyPricing(pricing), {
                removeCurrencyCodeFormatting: true,
              }),
            }}
            components={[<CrossedText key={'crossedPricing'} />]}
          />
        </Text>
        <Elements stripe={Stripe.instance}>
          {isPaymentProcessing || !pricing ? (
            <Loader style={{ height: '100%' }} />
          ) : (
            <StripeCardFollowUp
              promo={promo}
              promoErrorMessage={promoErrorMessage}
              pricing={pricing}
              onSuccessfulSubscription={onSuccessfulSubscription}
              style={{
                maxWidth: 420,
                marginTop: 40,
              }}
              user={user}
              experiments={experiments}
              isFollowUp={isFollowUp}
              setIsFollowUp={setIsFollowUp}
            />
          )}
        </Elements>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
export default FollowUpDiscount;
