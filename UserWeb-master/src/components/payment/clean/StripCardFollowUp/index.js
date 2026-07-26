import React, { useMemo } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import classNames from 'classnames';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import routeConstants from '@/utils/constants/routes';
import usePageQuery from '@/hooks/pageQuery';
import Link from 'next/link';
import Analytics from '@/services/Analytics';
import useTranslations from '@/hooks/translations';
import { getDiscountedPricing, getPricingForDuration } from '@/models/payment';
import { getLocaleImage } from '@/models/locale';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import useAuthUser from '../../../../hooks/authUser';
import Text from '../../../app/Text';
import AuraButton from '../../../app/AuraButton';
import styles from './styles';
import useStripeCard from '../../../../hooks/stripeCard';
import useThemeListener from '../../../../hooks/themeListener';
import { generateQueryPath } from '../../../../utils';
import CardInput from '../CardInput';

export default function StripeCardFollowUp({
  cardRef,
  pricing,
  onSuccessfulSubscription,
  onSubmitEmail,
  style,
  user,
  experiments,
  isFollowUp,
  setIsFollowUp,
}) {
  const { t, currentLocale } = useTranslations();
  const stripe = useStripe();
  const { isUserLoading, authLoading } = useAuthUser();
  const { isDark } = useThemeListener();
  const [, isMobile] = useResponsiveWindow();
  const { formatLocalPricing } = useConvertPriceInLocalCurrency({
    experiments,
  });
  const isDarkMode = isDark;

  const { handleSubmit, loading } = useStripeCard({
    onSuccessfulSubscription,
    onSubmitEmail,
    stripe,
  });

  const {
    campaign = null,
    utm_source = null,
    utm_campaign = null,
    redirectTo = null,
    sentFrom = null,
  } = usePageQuery({ fetchUserFromQuery: true });

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

  if (!stripe) {
    return null;
  }

  return (
    <div ref={cardRef} className="card-new" style={{ width: '100%', ...style }}>
      <form className="card-body green-border low-opacity">
        <div className="background" />
        <>
          <Text
            type="h3"
            color={isDarkMode ? 'b100' : 'g100'}
            align="center"
            style={{
              whiteSpace: 'pre-wrap',
            }}>
            {t('payment_subscribe_follow_up_total_due_today', {
              fee: formatLocalPricing(0, {
                maximumFractionDigits: 0,
              }),
            })}
          </Text>

          <Text
            type="subtitle"
            align="center"
            style={{
              fontSize: '13px',
              color: '#FFFFFFB2',
            }}>
            {t('payment_subscribe_follow_up_trial', { count: pricing.trial })}
          </Text>
          <img
            className="best-of-apple"
            src={getLocaleImage(
              '/static/images/bestOfApple2Lines.png',
              currentLocale
            )}
            alt="Apple logo"
          />
          {!isFollowUp && (
            <div style={{ width: '100%', padding: '0 20px' }}>
              <AuraButton
                onClick={() => {
                  Analytics.track('Continue Follow Up Discount Offer');
                  setIsFollowUp(true);
                }}
                style={{
                  width: '100%',
                  height: 64,
                  borderRadius: 32,
                  marginTop: 24,
                  marginBottom: 24,
                }}
                isGreenCta
                textWeight={'bold'}
                textStyle={{
                  textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
                  color: isDarkMode && '#fff',
                }}
                disabled={isUserLoading || authLoading}
                loading={isUserLoading || loading}
                title={t('button_continue')}
                withShadow
                cleanStyle
              />
              <Link href={closeRedirectLink} legacyBehavior>
                <Text
                  type="body2"
                  color="b100"
                  align="center"
                  style={{
                    margin: '20px 0',
                    textDecoration: 'underline',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    Analytics.track('Skip Follow Up Discount Offer');
                  }}>
                  {t('button_not_now')}
                </Text>
              </Link>
            </div>
          )}
        </>
        {isFollowUp && (
          <div className="card-without-border">
            <div style={{ width: '100%' }}>
              <hr className="top-border" />
            </div>
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
                  {t('protected_payment')}
                </Text>
              </div>
            </div>

            <div className="padded-content w-100 col align-center">
              <CardInput
                disabled={loading}
                experiments={experiments}
                useDarkTheme={true}
              />
            </div>
            <Text
              type="body2"
              color="b100"
              align="center"
              style={{
                whiteSpace: 'pre-wrap',
                lineHeight: '15px',
                fontSize: isMobile ? '12px' : '16px',
                marginTop: !isMobile && '6px',
                fontWeight: 400,
                color: '#FFFFFF',
              }}>
              {t(pricing.checkoutDescription, {
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
            <Text
              type="body2"
              color="b100"
              align="center"
              style={{
                whiteSpace: 'break-spaces',
                lineHeight: '15px',
                fontSize: isMobile ? '12px' : '16px',
                marginTop: '10px',
                fontWeight: 400,
                color: '#FFFFFF',
              }}>
              {t('payment_subscribe_follow_up_money_back_guarantee', {
                subtitle: t(pricing.subtitle),
              })}
            </Text>
            <AuraButton
              onClick={(e) => {
                handleSubmit(e);
              }}
              style={{
                width: '100%',
                height: 64,
                borderRadius: 32,
                marginTop: 24,
                marginBottom: 24,
              }}
              isGreenCta
              textWeight={'bold'}
              textStyle={{
                textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
                color: isDarkMode && '#fff',
              }}
              disabled={isUserLoading || authLoading}
              loading={isUserLoading || loading}
              title={t('payment_subscribe_follow_up_button_lets_begin')}
              withShadow
              cleanStyle
            />
            <div className="stripe-container">
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
            </div>
            <Link href={closeRedirectLink} legacyBehavior>
              <Text
                type="body2"
                color="b100"
                align="center"
                style={{
                  margin: '20px 0',
                  textDecoration: 'underline',
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  Analytics.track('Skip Follow Up Discount Offer');
                }}>
                {t('button_not_now')}
              </Text>
            </Link>
          </div>
        )}
      </form>
      <style jsx>{styles}</style>
    </div>
  );
}
