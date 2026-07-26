import { Elements } from '@stripe/react-stripe-js';
import React, { useCallback } from 'react';
import useTranslations from '@/hooks/translations';
import { getDiscount } from '@/models/payment';
import I18NFormatter from '@/services/I18NFormatter';
import { getLocaleImage } from '@/models/locale';
import Loader from '../../../app/Loader';
import Text from '../../../app/Text';
import Stripe from '../../../../services/Stripe';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import styles from './styles';
import StripeCard from '../StripeCard';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import BenefitsCoaching from '../BenefitsCoaching';
import useThemeListener from '../../../../hooks/themeListener';
import PurchasePopUpModal from '../PurchasePopUpModal';
import HowYourFreeTrialWorks from '../HowYourFreeTrialWorks';
import Benefits from '../Benefits';

function SubscribeClean(props) {
  const {
    coach,
    pricing,
    isProcessing: isPaymentProcessing,
    isCoaching,
    showPaywallBanner,
  } = useShallowEqualSelector(({ payment }) => payment);
  const {
    onSuccessfulSubscription,
    renderClose,
    promoErrorMessage,
    promoHideMessage,
    promo,
    setTotalPrice,
    fee,
    isShareReferral,
    isInfluencerReferral,
    purchaseModalRef,
    experiments,
    redirectToFollowUpDiscountOffer,
    showNotNow,
  } = props;
  const { isDark } = useThemeListener();
  const { t, currentLocale } = useTranslations();
  const showHowTrialWorks =
    pricing &&
    (pricing.trial === 7 || pricing.trial === 30) &&
    (!promo || (promo && !promoErrorMessage));
  const headerTitle = useCallback(() => {
    if (setTotalPrice)
      return t(pricing.pageTitle?.boldTextFee, {
        count: pricing.trial,
        discount: I18NFormatter.formatPercentage(getDiscount(pricing)),
      });
    return t(pricing.pageTitle?.boldText, {
      count: pricing.trial,
      discount: I18NFormatter.formatPercentage(getDiscount(pricing)),
    });
  }, [pricing, setTotalPrice, t]);

  return (
    <div className="clean-subscribe relative">
      <div className="container">
        {!pricing?.shortHeaderUI && (
          <>
            <img
              src={getLocaleImage(
                '/static/images/bestOfApple2Lines.png',
                currentLocale
              )}
              alt="Best of Apple"
              className="best-of-apple"
            />
            <img
              src="/static/images/5stars.png"
              alt="Rated 5 stars"
              style={{
                height: 16,
                objectFit: 'contain',
                marginBottom: 4,
              }}
            />
          </>
        )}
        {pricing?.shortHeaderUI && (
          <img
            src="/static/images/best-of-apple-with-rating.svg"
            alt="Best of Apple"
            className="best-of-apple-no-sku"
          />
        )}
        <Text type="body2" color={isDark ? 'b64' : 'g50'} align="center">
          {t('payment_subscribe_reviews')}
        </Text>
        {isCoaching && (
          <>
            <div className="coach-image">
              <img
                src="/static/images/coachingOnboarding/coach-landing-background.png"
                alt="coach"
                className="background-image"
              />
              <div className="coach">
                <img
                  src={coach && getCoachPhoto(coach, 'photoUrl')}
                  alt="coach"
                  className="coach-thumb"
                />
              </div>
            </div>
            <Text
              type="h3-small"
              align="center"
              color="g50"
              style={{ marginTop: 20 }}>
              {t('payment_subscribe_1_1_coaching')}
            </Text>
            <div className="coach-name">
              <Text
                type="h3"
                align="center"
                color="g100"
                style={{ marginTop: 10 }}>
                {coach && getCoachName(coach)}
              </Text>
              <img
                src="/static/images/coachingOnboarding/blue-star.png"
                alt="aura-star"
                className="star"
              />
            </div>
            <Text
              type="body2"
              align="center"
              color="b40"
              style={{ marginTop: 10 }}>
              {coach && coach.professionalTitle}
            </Text>
          </>
        )}
        {!isCoaching && pricing && !pricing?.shortHeaderUI && (
          <div className="welcome-text">
            <Text type="h3-large" component="h1" color="b100" align="center">
              {`${t(pricing.pageTitle?.text)} `}
              <span className="bold">{headerTitle()}</span>
            </Text>
            {!setTotalPrice && pricing.pageSubtitle && (
              <Text
                type="body"
                color={isDark ? 'b64' : 'g50'}
                align="center"
                weight="regular">
                {t(pricing.pageSubtitle)}
              </Text>
            )}
            {/* Default value for page subtitle when user pricing has trial and user choses no trial fees */}
            {!setTotalPrice && pricing.trial !== 0 && !pricing.pageSubtitle && (
              <Text
                type="body"
                color={isDark ? 'b64' : 'g50'}
                align="center"
                weight="regular">
                {t('payment_subscribe_enjoy_first_week')}
              </Text>
            )}
            {((!promo && !isInfluencerReferral) ||
              pricing.discountDescription === '50%') && (
              <div className="w-100 row justify-center">
                <div className="off-label-contanier">
                  <Text
                    type="body2"
                    color="b100"
                    align="center"
                    weight="regular"
                    style={{ textShadow: '0px 3px 8px rgba(0, 0, 0, 0.15)' }}>
                    {t('payment_subscribe_50_off_yearly')}
                  </Text>
                </div>
              </div>
            )}
          </div>
        )}
        {isCoaching && (
          <>
            <hr className="hr" />
            <div className="membership-price">
              <Text type="body2" color="b100">
                {t('payment_subscribe_membership')}
              </Text>
              <Text type="body2" color={isDark ? 'b64' : 'g50'}>
                {I18NFormatter.formatCurrency(200, {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </div>
          </>
        )}
        {isCoaching && <BenefitsCoaching coachName={getCoachName(coach)} />}
        {experiments?.noTrial3SKUs !== 'c' &&
          experiments?.threeSKUsV2 !== 'a' &&
          !isCoaching && (
            <>
              {showHowTrialWorks && !pricing?.shortHeaderUI && (
                <HowYourFreeTrialWorks
                  setTotalPrice={setTotalPrice}
                  setMarginTop
                  setMarginBottom
                  pricing={pricing}
                />
              )}
              {!showHowTrialWorks && !pricing?.shortHeaderUI && (
                <div className="benefits-no-trial">
                  <Benefits isBlinklistStyle />
                </div>
              )}
            </>
          )}
        {isCoaching && (
          <>
            <div className="membership-discount">
              <Text type="body2" color="cta-blue" weight="bold">
                {t('payment_subscribe_invite_only_discount')}
              </Text>
              <Text type="body2" color="cta-blue" weight="bold">
                -
                {I18NFormatter.formatCurrency(51, {
                  maximumFractionDigits: 0,
                })}
              </Text>
            </div>
            <Text type="body2" color="g100" style={{ marginTop: 10 }}>
              {t('payment_subscribe_try_risk_free', { count: 30 })}
            </Text>
            <hr className="hr2" />
          </>
        )}
        <Elements stripe={Stripe.instance}>
          {isPaymentProcessing || !pricing ? (
            <Loader style={{ height: '100%' }} />
          ) : (
            <StripeCard
              fee={fee}
              setTotalPrice={setTotalPrice}
              promo={promo}
              promoHideMessage={promoHideMessage}
              promoErrorMessage={promoErrorMessage}
              pricing={pricing}
              onSuccessfulSubscription={onSuccessfulSubscription}
              style={{
                maxWidth: 420,
              }}
              isShareReferral={isShareReferral}
              isInfluencerReferral={isInfluencerReferral}
              redirectToFollowUpDiscountOffer={redirectToFollowUpDiscountOffer}
              showNotNow={showNotNow}
              showHowTrialWorks={showHowTrialWorks}
            />
          )}
        </Elements>
        {renderClose && typeof renderClose === 'function' && renderClose()}
      </div>
      {showPaywallBanner && <PurchasePopUpModal ref={purchaseModalRef} />}
      <style jsx>{styles}</style>
    </div>
  );
}
export default SubscribeClean;
