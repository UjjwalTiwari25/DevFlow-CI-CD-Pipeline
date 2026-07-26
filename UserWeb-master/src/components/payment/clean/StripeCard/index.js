import React, { useCallback, useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import classNames from 'classnames';
import Image from 'next/image';
import useTranslations from '@/hooks/translations';
import { Trans } from 'react-i18next';
import {
  getDiscount,
  getDiscountedPricing,
  getDiscountPrice,
  getPricingForDuration,
  getYearlyPricing,
} from '@/models/payment';
import { isAndroidDevice } from '@/utils';
import I18NFormatter from '@/services/I18NFormatter';
import { getUserFirstName } from '@/models/user';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import { getLocaleImage } from '@/models/locale';
import usePageQuery from '@/hooks/pageQuery';
import CardInput from '../CardInput';
import useAuthUser from '../../../../hooks/authUser';
import Text from '../../../app/Text';
import Input from '../../../app/Input';
import AuraButton from '../../../app/AuraButton';
import useExperiments from '../../../../hooks/experiments';
import styles from './styles';
import SupportOthers from '../SupportOthers';
import DonateCard from '../DonateCard';
import useStripeCard from '../../../../hooks/stripeCard';
import PrivateInfo from '../PrivateInfo';
import MoneyBackGuarantee from '../MoneyBackGuarantee';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import AppleGoogleReviews from '../AppleGoogleReviews';
import useThemeListener from '../../../../hooks/themeListener';
import pricingConstants from '../../../../utils/constants/pricing';
import FaqList from '../FaqList';
import YourAuraScore from '../YourAuraScore';
import PaymentSocialProof from '../PaymentSocialProof';
import Benefits from '../Benefits';
import Analytics from '../../../../services/Analytics';
import { getPaywallAnalyticsProperties } from '../../../../utils/paywallAnalytics';
import PricingTitleAndDescription from './PricingTitleAndDescription';
import ApplePayButton from '../../ApplePayButton';
import GooglePayButton from '../../GooglePayButton';
import AppleLogo from '../../ApplePayButton/AppleLogo';

const EXPERIMENTS = [];

export default function StripeCard({
  cardRef,
  pricing,
  onSuccessfulSubscription,
  showEmailInput,
  onSubmitEmail,
  style,
  promoErrorMessage,
  promoHideMessage,
  promo,
  setTotalPrice,
  fee,
  isShareReferral,
  redirectToFollowUpDiscountOffer,
  showNotNow,
  isInfluencerReferral,
  showHowTrialWorks,
}) {
  const pageQuery = usePageQuery();
  const { threeSKUV2 } = pageQuery;
  const stripe = useStripe();
  const { user, userError, isUserLoading, authLoading } = useAuthUser();

  if (
    threeSKUV2 &&
    (threeSKUV2 === true || threeSKUV2.toLowerCase() === 'true') &&
    !EXPERIMENTS.includes('threeSKUsV2')
  ) {
    EXPERIMENTS.push('threeSKUsV2');
  }

  const [experiments] = useExperiments(EXPERIMENTS, user);
  const { formatLocalPricing } = useConvertPriceInLocalCurrency();

  const showGooglePay = isAndroidDevice();

  const { isCoaching, referrer } = useShallowEqualSelector(
    ({ payment }) => payment
  );

  const { isDark } = useThemeListener();
  const [isMonthlyPricing, setIsMonthlyPricing] = useState(null);
  const authAmountCents = 999;
  const { t, currentLocale } = useTranslations();

  useEffect(() => {
    setIsMonthlyPricing(pricing.id === pricingConstants.PRICING_MONTHLY);
  }, [pricing.id]);

  const changeCtaTitle = useCallback(() => {
    if (isCoaching) {
      return 'payment_subscribe_button_1_1_coaching';
    }
    if (experiments?.threeSKUsV2 === 'a') return 'button_confirm_payment';
    return (setTotalPrice && pricing.checkoutFee) || pricing.checkout;
  }, [
    experiments?.threeSKUsV2,
    isCoaching,
    pricing.checkout,
    pricing.checkoutFee,
    setTotalPrice,
  ]);

  const isDarkMode = isDark && !isCoaching && !isShareReferral;
  const {
    handlePaymentRequestSubmit,
    handleSubmit,
    onChangeEmail,
    onSubmitEmailInput,
    paymentRequest,
    canShowPaymentRequest,
    applePay,
    googlePay,
    showUserError,
    loading,
  } = useStripeCard({
    showQuickCheckout: true,
    onSuccessfulSubscription,
    onSubmitEmail,
    stripe,
    experiments,
    fee,
    setTotalPrice,
  });

  const getPricingDurationText = () => {
    if (pricing.duration === 1) return 'payment_subscribe_terms_duration_month';
    if (pricing.duration === 3)
      return 'payment_subscribe_terms_duration_3_months';
    if (pricing.duration === 6)
      return 'payment_subscribe_terms_duration_6_months';
    return 'payment_subscribe_terms_duration_year';
  };

  const getTermsOfUseKey = () => {
    if (pricing.duration === 1) return 'payment_subscribe_terms_of_use_monthly';
    if (pricing.duration === 3 && pricing.trial > 0)
      return 'payment_subscribe_terms_of_use_3_month_trial';
    if (pricing.duration === 3) return 'payment_subscribe_terms_of_use_3_month';
    if (pricing.duration === 6)
      return 'payment_subscribe_terms_of_use_6_month_no_trial';
    if (setTotalPrice)
      return pricing?.descriptionFee || 'payment_subscribe_terms_of_use_trial';
    return pricing?.description || 'payment_subscribe_terms_of_use';
  };

  const showPaymentRequestButton = canShowPaymentRequest && paymentRequest;

  const showApplePayButton = showPaymentRequestButton && applePay;

  const showGooglePayButton =
    showPaymentRequestButton && googlePay && showGooglePay;

  const showPaymentProviders = showApplePayButton || showGooglePayButton;

  useEffect(() => {
    if (showApplePayButton) {
      Analytics.setPeopleProperties({
        'Apple Pay': true,
      });
    }
    if (showGooglePayButton) {
      Analytics.setPeopleProperties({
        'Google Pay': true,
      });
    }
  }, [showApplePayButton, showGooglePayButton]);

  const getLinkColor = (isDarkModeParam) =>
    isDarkModeParam ? '#fff' : '#9092A3';

  if (!stripe) {
    return null;
  }
  return (
    <div
      ref={cardRef}
      className="card-new"
      style={{ ...style }}
      id="payment-input">
      <form className="card-body">
        <div className="background" />
        {isCoaching && (
          <div className="due-today">
            <Text type="body2" color="b100">
              {t('payment_subscribe_total_due')}
            </Text>
            <Text type="body2" color="b100">
              {formatLocalPricing(149, { maximumFractionDigits: 0 })}
            </Text>
          </div>
        )}
        {!isCoaching && !showPaymentProviders && !pricing?.shortHeaderUI && (
          <>
            <PricingTitleAndDescription
              pricing={pricing}
              isDarkMode={isDarkMode}
              setTotalPrice={setTotalPrice}
              fee={fee}
              experiments={experiments}
              isCoaching={isCoaching}
              promo={promo}
              isInfluencerReferral={isInfluencerReferral}
            />

            {(setTotalPrice || !pricing.trial) && (
              <Text
                type="subtitle"
                color={isDarkMode ? 'b100' : 'g100'}
                align="center"
                style={{
                  whiteSpace: 'pre-wrap',
                  maxWidth: isShareReferral ? 280 : 269,
                  marginTop: '19px',
                }}>
                {t(pricing.subtitleFee)}
              </Text>
            )}
            {!setTotalPrice && !!pricing.trial && (
              <Text
                type="subtitle"
                color={isDarkMode ? 'b100' : 'g100'}
                align="center"
                style={{
                  whiteSpace: 'pre-wrap',
                  maxWidth: isShareReferral ? 280 : 269,
                  marginTop: '19px',
                }}>
                {t(pricing.subtitle)}
              </Text>
            )}
          </>
        )}

        {pricing?.shortHeaderUI && !isCoaching && (
          <>
            <Text
              type="h4-large"
              color={isDarkMode ? 'b100' : 'g100'}
              align="center"
              weight="bold"
              style={{
                marginTop: 16,
                marginBottom: 24,
                lineHeight: '25px',
                maxWidth: 300,
              }}>
              {t('payment_subscribe_no_sku_title')}
            </Text>
            {pricing?.trial > 0 && (
              <Text
                type="h4-large"
                align="center"
                weight="bold"
                style={{
                  marginBottom: 12,
                  lineHeight: '25px',
                  width: '100%',
                  textShadow: 'unset',
                  background:
                    'linear-gradient(90deg, #08F057 0%, #B1FF74 100%)',
                  'background-clip': 'text',
                  'webkit-background-clip': 'text',
                  'webkit-text-fill-color': 'transparent',
                }}>
                {t('text_start_your_seven_day_trial', {
                  count: pricing?.trial,
                })}
              </Text>
            )}
            <div className="total-price-no-sku">
              <Text
                color="b70"
                type="h4">{`${t(experiments?.threeSKUsV2 === 'a' ? 'payment_subscribe_total_due' : 'payment_subscribe_total')}:`}</Text>
              <div className="total-price-no-sku-pricing">
                {getDiscount(pricing) > 0 && !pricing.trial && (
                  <Text
                    color="b70"
                    type="h4"
                    style={{
                      textDecoration: 'line-through',
                      textDecorationColor: '#FF3B30',
                    }}>
                    {formatLocalPricing(getYearlyPricing(pricing))}
                  </Text>
                )}
                <Text color="b100" type="h4">
                  {formatLocalPricing(
                    pricing?.trial > 0 ? 0 : getDiscountedPricing(pricing)
                  )}
                </Text>
              </div>
            </div>
          </>
        )}
        {!showPaymentProviders && !pricing?.shortHeaderUI && (
          <div
            className="card-title"
            style={{
              marginBottom: '24px',
            }}
          />
        )}
        <div
          id="card-details"
          className={classNames('card-without-border', {
            'low-opacity': isDarkMode,
            'card-with-less-top-margin': pricing?.shortHeaderUI,
            'card-with-more-padding': pricing?.shortHeaderUI,
          })}>
          {showPaymentProviders && (
            <div className="payment-providers-wrapper">
              {!pricing?.shortHeaderUI && (
                <PricingTitleAndDescription
                  pricing={pricing}
                  isDarkMode={isDarkMode}
                  setTotalPrice={setTotalPrice}
                  fee={fee}
                  showPaymentProviders={showPaymentProviders}
                  experiments={experiments}
                  isCoaching={isCoaching}
                />
              )}
              {!pricing?.shortHeaderUI && (
                <Image
                  src={getLocaleImage(
                    '/static/images/bestOfAppleWhite.png',
                    currentLocale
                  )}
                  height={33}
                  width={129}
                  alt="Best of Apple"
                  style={{
                    height: 'auto',
                    marginTop: '12px',
                    marginBottom: '24px',
                  }}
                />
              )}

              {showApplePayButton && (
                <ApplePayButton
                  onClick={handlePaymentRequestSubmit}
                  disabled={isUserLoading || loading}
                  hideAppleLogo={true}
                  title={
                    <Trans
                      ns="subscribe"
                      i18nKey="payment_subscribe_exp_apple_pay"
                      components={[<AppleLogo key="applePay" />]}
                    />
                  }
                />
              )}

              {showGooglePayButton && (
                <GooglePayButton
                  onClick={handlePaymentRequestSubmit}
                  disabled={isUserLoading || loading}
                  title={t('button_continue_with')}
                />
              )}

              <div className="separator-container">
                <div className="separator" />
                <Text
                  color="b100"
                  type="body"
                  align="center"
                  style={{
                    lineHeight: '22px',
                    fontWeight: '500',
                    margin: '0 16px',
                  }}>
                  {t('text_or')}
                </Text>
                <div className="separator" />
              </div>
            </div>
          )}
          <div className="credit-protection">
            <img
              id="cards-image"
              src="/static/images/creditCards.png"
              alt="Cards"
            />
            <div className="protection-container">
              <img
                src="/static/images/icons/protected.png"
                alt="protection"
                className="protection-icon"
              />
              <Text
                type="footnote"
                color={isDarkMode ? 'b64' : 'g64'}
                align="left"
                style={{ maxWidth: '54px', lineHeight: '10px' }}>
                {t('payment_subscribe_protected_payment')}
              </Text>
            </div>
          </div>
          <div className="padded-content w-100 col align-center">
            {showEmailInput && (
              <Input
                placeholder={t('payment_subscribe_placeholder_email')}
                type="email"
                error={userError && showUserError}
                onChange={onChangeEmail}
                onBlur={onSubmitEmailInput}
                borderStyle
              />
            )}
            <CardInput disabled={loading} experiments={experiments} />
          </div>
          {promo && promoErrorMessage && !promoHideMessage && (
            <Text
              type="body2"
              color={isDarkMode ? 'b100' : 'g100'}
              align="center"
              style={{
                whiteSpace: 'pre-wrap',
                marginTop: 24,
                lineHeight: '17px',
              }}>
              {`${promoErrorMessage}`}
            </Text>
          )}
          {((promo && !promoErrorMessage && !promoHideMessage) ||
            isInfluencerReferral) && (
            <Text
              type="body2"
              color={isDarkMode ? 'b100' : 'g100'}
              align="center"
              style={{
                whiteSpace: 'pre-wrap',
                marginTop: isMonthlyPricing ? 19 : 24,
                lineHeight: '17px',
              }}>
              {t('payment_subscribe_promo_code', {
                promo: promo || getUserFirstName(referrer),
                description: I18NFormatter.formatPercentage(
                  getDiscount(pricing)
                ),
              })}
            </Text>
          )}
          {!isCoaching && (
            <div>
              <Text
                type="footnote-small"
                color="b100"
                align="left"
                style={{
                  whiteSpace: 'pre-wrap',
                  marginTop: 12,
                  marginBottom: 0,
                  lineHeight: '12px',
                }}>
                <Trans
                  ns="subscribe"
                  i18nKey={getTermsOfUseKey()}
                  values={{
                    yearlyPricing: formatLocalPricing(
                      getYearlyPricing(pricing)
                    ),
                    monthlyPricing: formatLocalPricing(
                      getPricingForDuration(pricing)
                    ),
                    discountedPricing: formatLocalPricing(
                      getDiscountedPricing(pricing)
                    ),
                    duration: t(getPricingDurationText()),
                  }}
                  components={[
                    <span
                      key="moneyBackGuarantee"
                      style={{ fontWeight: '700' }}></span>,
                    <a
                      key="termsOfUse"
                      href={t('terms_of_service_link')}
                      target="_blank"
                      style={{
                        color: getLinkColor(isDarkMode),
                        textDecoration: 'underline',
                      }}
                      rel="noreferrer"></a>,
                    <a
                      key="privacyPolicy"
                      href={t('privacy_policy_link')}
                      target="_blank"
                      style={{
                        textDecoration: 'underline',
                        color: getLinkColor(isDarkMode),
                      }}
                      rel="noreferrer"></a>,
                  ]}
                />{' '}
                {t('get_app_authorization_amount_will_refund', {
                  ns: 'getapp',
                  amount: formatLocalPricing(authAmountCents / 100),
                })}
              </Text>
            </div>
          )}
          {pricing &&
            pricing.showInvoice &&
            !promo &&
            !isInfluencerReferral && (
              <div style={{ width: '100%', paddingTop: 20 }}>
                {pricing && pricing.discountDescription && pricing.discount && (
                  <div>
                    {pricing.exclusive && (
                      <div className="invoice-item">
                        <InvoiceItemText
                          align="left"
                          label={pricing.exclusive}
                          style={{ color: '#03a9f4' }}
                        />
                      </div>
                    )}
                    <div className="invoice-item">
                      <InvoiceItemText
                        label={pricing.subtotal || 'Subtotal'}
                        align="left"
                      />
                      <InvoiceItemText
                        label={formatLocalPricing(getYearlyPricing(pricing))}
                        align="right"
                      />
                    </div>
                    <div className="invoice-item">
                      <InvoiceItemText
                        label={`Discount (${pricing.discountDescription})`}
                        style={{ color: '#03a9f4' }}
                        align="left"
                      />
                      <InvoiceItemText
                        label={`- ${formatLocalPricing(getDiscountPrice(pricing))}`}
                        style={{ color: '#03a9f4' }}
                        align="right"
                      />
                    </div>
                    <div
                      style={{
                        height: '1px',
                        backgroundColor: '#ccc',
                        marginBottom: 12,
                      }}
                    />
                  </div>
                )}
                <div className="invoice-item" style={{ marginTop: '4px' }}>
                  <InvoiceItemText
                    label={
                      setTotalPrice ? t(pricing.totalFee) : t(pricing.total)
                    }
                    align="left"
                  />
                  <InvoiceItemText
                    label={
                      formatLocalPricing(getDiscountedPricing(pricing)) ||
                      formatLocalPricing(getYearlyPricing(pricing))
                    }
                    align="right"
                  />
                </div>
              </div>
            )}

          {pricingConstants.PRICING_DEFAULT !== pricing.id &&
            pricingConstants.PRICING_YEARLY_5999_7DAYS !== pricing.id &&
            pricingConstants.PRICING_YEARLY_7999_7DAYS !== pricing.id &&
            pricingConstants.PRICING_YEARLY_8999_7DAYS !== pricing.id &&
            !pricing.showDiscountSubtitle &&
            !pricing?.shortHeaderUI && (
              <Text
                type="body2"
                color={isDarkMode ? 'b100' : 'g100'}
                align="center"
                style={{
                  whiteSpace: 'pre-wrap',
                  marginTop: 24,
                  lineHeight: '17px',
                }}>
                {setTotalPrice
                  ? t(pricing.checkoutDescriptionFee, {
                      count: pricing.trial,
                      yearlyPricing: formatLocalPricing(
                        getDiscountedPricing(pricing)
                      ),
                      monthlyPricing: formatLocalPricing(
                        getPricingForDuration(pricing)
                      ),
                      weeklyPricing: formatLocalPricing(
                        getPricingForDuration(pricing, 'weekly')
                      ),
                    })
                  : t(pricing.checkoutDescription, {
                      count: pricing.trial,
                      yearlyPricing: formatLocalPricing(
                        getDiscountedPricing(pricing)
                      ),
                      monthlyPricing: formatLocalPricing(
                        getPricingForDuration(pricing)
                      ),
                      weeklyPricing: formatLocalPricing(
                        getPricingForDuration(pricing, 'weekly')
                      ),
                    })}
              </Text>
            )}

          <AuraButton
            onClick={(e) => {
              handleSubmit(e);
            }}
            style={
              experiments?.threeSKUsV2 === 'a'
                ? {
                    width: '100%',
                    height: 56,
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(45deg, #08F057 0%, #B1FF74 100%)',
                    boxShadow: '0px 8px 40px 2px rgba(56, 218, 247, 0.30)',
                    padding: '25px 32px',
                    marginBottom: 24,
                    marginTop: isCoaching ? 0 : 16,
                  }
                : {
                    width: '100%',
                    height: 64,
                    borderRadius: 32,
                    marginTop: isCoaching ? 0 : 24,
                    marginBottom: 24,
                  }
            }
            textWeight={'bold'}
            textStyle={{
              textShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)',
              color: isDarkMode && '#fff',
              fontSize: experiments?.threeSKUsV2 === 'a' ? '16px' : '18px',
            }}
            disabled={isUserLoading || authLoading}
            loading={isUserLoading || loading}
            isGreenCta={true}
            title={t(changeCtaTitle(), {
              discountPercentage: I18NFormatter.formatPercentage(
                getDiscount(pricing)
              ),
            })}
            withShadow
            cleanStyle
          />
          <div
            className={classNames('stripe-container')}
            style={{
              justifyContent: 'center',
            }}>
            <>
              <img
                src={getLocaleImage(
                  '/static/images/stripe/PoweredByStripe.png',
                  currentLocale
                )}
                alt="aura stripe"
                className={classNames('powered-by-stripe', {
                  invert: !isDark,
                })}
              />
              <img
                src="/static/images/stripe/secured.png"
                alt="aura stripe"
                className={classNames('secured-by-stripe', {
                  invert: !isDark,
                })}
              />
            </>
          </div>

          <div className="checkout-text remove-margin">
            {isCoaching && (
              <div className="refund">
                <Text
                  type="footnote"
                  color="g100"
                  align="center"
                  style={{
                    marginTop: 6,
                    maxWidth: 266,
                  }}>
                  <Trans
                    ns="subscribe"
                    i18nKey="payment_subscribe_you_may_cancel"
                    values={{
                      monthlyPricing: formatLocalPricing(149),
                    }}
                    components={[
                      <a key="contactUs" href="mailto:hello@aurahealth.io"></a>,
                    ]}
                  />
                </Text>
              </div>
            )}
            {isCoaching && (
              <div className={isCoaching && 'refund'}>
                <Text
                  type="footnote"
                  color={isDarkMode ? 'b100' : 'g100'}
                  align="center"
                  weight={isCoaching ? 'bold' : 'normal'}
                  style={{
                    whiteSpace: 'pre-wrap',
                    marginTop: 6,
                    maxWidth: isCoaching && 260,
                  }}>
                  {t('payment_subscribe_still_not_convinced')}
                </Text>
              </div>
            )}
          </div>
          {showNotNow && (
            <div
              onClick={() => {
                Analytics.track('Web Subscription Close', {
                  ...getPaywallAnalyticsProperties({
                    redirectedFromApp: false,
                  }),
                });
                redirectToFollowUpDiscountOffer();
              }}>
              <Text
                type="body"
                color="b100"
                align="center"
                style={{
                  margin: '20px 0 0',
                  position: 'relative',
                  cursor: 'pointer',
                }}>
                {t('button_not_now')}
              </Text>
            </div>
          )}
        </div>
      </form>

      {!pricing?.shortHeaderUI && (
        <>
          {!showHowTrialWorks && (
            <div className="benefits-no-trial">
              <Benefits isBlinklistStyle />
            </div>
          )}
          {showHowTrialWorks && <Benefits isBlinklistStyle />}
          {!isCoaching && !isShareReferral && <PaymentSocialProof />}
          <AppleGoogleReviews />
          {isCoaching && <PrivateInfo />}

          {user?.onboardingAuraScoreValue && (
            <YourAuraScore
              yourScore={user?.onboardingAuraScoreValue}
              experiments={experiments}
            />
          )}
          <MoneyBackGuarantee />

          <SupportOthers isCoaching={isCoaching} />
          <DonateCard isCoaching={isCoaching} />

          {!isCoaching && !isShareReferral && <FaqList />}
        </>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}

function InvoiceItemText({ label, style, align }) {
  return (
    <Text
      type="body2"
      color="b64"
      align={align}
      style={{ marginBottom: 12, minWidth: 96, ...style }}>
      {label}
    </Text>
  );
}
