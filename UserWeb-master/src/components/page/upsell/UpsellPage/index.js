import classNames from 'classnames';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useTheme, { THEMES } from '@/hooks/theme';
import pricingConstants from '@/utils/constants/pricing';
import usePageQuery from '@/hooks/pageQuery';
import useTranslations from '@/hooks/translations';
import { Trans } from 'react-i18next';
import {
  getDiscountedPricing,
  getIndividualPricing,
  getPerPersonPricing,
  getPricingForDuration,
  getYearlyPricing,
} from '@/models/payment';
import I18NFormatter from '@/services/I18NFormatter';
import { getLocaleImage } from '@/models/locale';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import useThemeListener from '../../../../hooks/themeListener';
import AuraButton from '../../../app/AuraButton';
import Text from '../../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../../hooks/browserHistory';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import {
  handleProcessSubscription,
  setTrialFee,
  handleGetUpsellPricing,
  setCoach,
} from '../../../../store/slices/payment';
import useAuthUser from '../../../../hooks/authUser';
import Analytics from '../../../../services/Analytics';
import useToastMessage from '../../../../hooks/toastMessage';

export default function UpsellPage({ addScreen, onNext, onBack, experiments }) {
  useBrowserHistory('upsellPage', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();
  const { pricing, isProcessing } = useShallowEqualSelector(
    ({ payment }) => payment
  );
  const { formatLocalPricing } = useConvertPriceInLocalCurrency({
    experiments,
  });
  const { isDark } = useThemeListener();
  const { user } = useAuthUser();
  const { trial } = usePageQuery();
  const dispatch = useDispatch();
  const { showError } = useToastMessage();
  useTheme(THEMES.DARK);

  useEffect(() => {
    // Reset trial fee - required for web coaching 99 cent trial
    dispatch(setTrialFee(null));
  }, [dispatch]);

  useEffect(() => {
    const webYearlyPricingVariant = experiments?.webYearlyPricing;
    let pricingId = pricing?.id;
    if (trial === '30') {
      pricingId = pricingConstants.PRICING_UPSELL_FAMILY_6_30DAYS;
    } else if (webYearlyPricingVariant === 'a') {
      pricingId = pricingConstants.PRICING_UPSELL_FAMILY_6_7999;
    } else if (webYearlyPricingVariant === 'c') {
      pricingId = pricingConstants.PRICING_UPSELL_FAMILY_6_8999;
    }
    if (pricingId !== pricing?.id)
      dispatch(handleGetUpsellPricing({ id: pricingId }));
    dispatch(setCoach(null));
  }, [dispatch, pricing?.id, trial, experiments]);

  const handleRedirect = () => {
    Analytics.track('Skip Upsell');
    onNext();
  };

  async function handlePayment() {
    if (!user) {
      showError('No account found!');
    }
    Analytics.track('Web Subscription Upsell Processing', {
      PricingId: pricing.id,
      PricingName: pricing.name,
      YearlyPricing: pricing.yearlyPricing,
      Price: pricing.upsellPricing,
    });
    const response = await dispatch(
      handleProcessSubscription({ isUpsell: true })
    ).unwrap();
    if (response && !response.error) {
      addScreen('shareSubscription', { previousScreen: 'upsell' });
      onNext();
    } else {
      showError('Failed to process family plan');
    }
  }

  return (
    <div
      className={classNames('col align-center', {
        'dark-background': isDark,
        'light-background': !isDark,
      })}>
      {pricing && (
        <div className="page">
          <img
            src="/static/images/familyPlan/heartLogo.png"
            alt="aura"
            className="logo"
          />
          <div className={classNames('text-container exist-cta-margin')}>
            <Text type="cta" color="b100" align="center">
              {t('upsell_fp_thank_you')}
            </Text>
          </div>
          <div>
            <Text
              type="h4"
              color="b100"
              align="center"
              weight="regular"
              style={{
                maxWidth: 250,
              }}>
              {t('upsell_fp_share_gift')}
            </Text>
            <Text type="h4-large" color="b100" align="center" weight="bold">
              {t('upsell_fp_save_upto', {
                save: pricing.discountDescription.includes('$')
                  ? formatLocalPricing(
                      Number.parseFloat(
                        pricing.discountDescription.replace('$', '').trim()
                      )
                    )
                  : pricing.discountDescription,
              })}
            </Text>
          </div>
          <div>
            <Text
              color="b100"
              type="h3-small"
              align="center"
              weight="semibold"
              style={{
                marginTop: 38,
              }}>
              {t(pricing.title, { due: formatLocalPricing(0) })}
            </Text>

            <Text
              color="b64"
              type="footnote"
              align="center"
              weight="regular"
              style={{
                marginTop: 3,
              }}>
              {t('upsell_fp_cancel_anytime')}
            </Text>
          </div>
          <div className="pricing-container">
            <img
              src="/static/images/familyPlan/background.png"
              alt="aura"
              className={classNames('pricing-background', {
                'low-background': !isDark,
              })}
            />
            {pricing && (
              <div className="pricing clickable  green-border increase-padding">
                <div>
                  <div className="row">
                    <Text
                      type="h4-large"
                      color="b100"
                      align="left"
                      weight="semibold"
                      style={{ lineHeight: '18px' }}>
                      {t('upsell_fp_plan', {
                        plan: t('upsell_fp_pricing_display_name_family'),
                      })}
                    </Text>
                    {pricing.bestValue && (
                      <div className="best-value low-shadow">
                        <Text
                          type="footnote"
                          color={isDark ? 'b100' : 'w100'}
                          weight="semibold">
                          {t('upsell_fp_best_value')}
                        </Text>
                      </div>
                    )}
                  </div>
                  <Text
                    type="footnote"
                    color="b64"
                    align="left"
                    style={{ marginTop: 4 }}>
                    {t(pricing.subtitle, {
                      accounts: I18NFormatter.formatNumber(
                        pricing.maxFamilyMembers - 1
                      ),
                      discountedPricing: formatLocalPricing(
                        getDiscountedPricing(pricing),
                        { maximumFractionDigits: 0 }
                      ),
                      monthlyPricing: formatLocalPricing(
                        getPricingForDuration(pricing),
                        { maximumFractionDigits: 2 }
                      ),
                    })}
                  </Text>
                  <div className="row align-center">
                    <Text
                      type="body2"
                      align="left"
                      weight="semibold"
                      style={{
                        background:
                          'linear-gradient(to right, #79EB33, #0BF066)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent',
                        marginTop: 4,
                      }}>
                      {t(pricing.checkout, {
                        perPersonPrice: formatLocalPricing(
                          getPerPersonPricing(pricing),
                          { maximumFractionDigits: 2 }
                        ),
                      })}
                    </Text>
                    <Text
                      type="body2"
                      align="left"
                      weight="regular"
                      color="b64"
                      style={{ marginTop: 4, marginLeft: 4 }}>
                      {t('upsell_fp_yearly_pricing', {
                        yearlyPricing: formatLocalPricing(
                          getYearlyPricing(pricing)
                        ),
                      })}
                    </Text>
                  </div>
                  {trial !== '0' && (
                    <Text
                      type="body2"
                      color="b100"
                      align="left"
                      style={{ marginTop: 16 }}>
                      {t('upsell_fp_trial', { trial: pricing.trial })}
                    </Text>
                  )}
                </div>
              </div>
            )}
          </div>
          <>
            <div className="social-proof-container">
              <img
                src={getLocaleImage(
                  '/static/images/bestOfAppleWhite.png',
                  currentLocale
                )}
                alt="aura"
                className="bestOfApple"
              />
            </div>
            <Text
              type="footnote"
              color="b64"
              align="center"
              style={{
                marginBottom: 3,
              }}>
              {t('upsell_fp_loved_by_people')}
            </Text>

            <div className="obviuos-price-container">
              {trial !== '0' && (
                <Text type="footnote" color="b64" align="center">
                  {t('upsell_fp_trial_then_yearly', {
                    count: pricing.trial,
                    discountedPrice: formatLocalPricing(
                      getDiscountedPricing(pricing),
                      { maximumFractionDigits: 0 }
                    ),
                  })}
                </Text>
              )}
              {trial !== '0' ? (
                <Text
                  type="footnote"
                  color="b64"
                  align="center"
                  style={{ marginTop: 3 }}>
                  {t('upsell_fp_total_yearly_price', {
                    individualPrice: formatLocalPricing(
                      getIndividualPricing(pricing) || 69.99
                    ),
                    discountedPrice: formatLocalPricing(
                      getDiscountedPricing(pricing),
                      { maximumFractionDigits: 0 }
                    ),
                    yearlyPricing: formatLocalPricing(
                      getYearlyPricing(pricing)
                    ),
                  })}
                </Text>
              ) : (
                <Text
                  type="footnote"
                  color="b64"
                  align="center"
                  style={{ marginTop: 3 }}>
                  {t('upsell_fp_stripe_offer_total_yearly_price', {
                    price: formatLocalPricing(getIndividualPricing(pricing)),
                    discountedPrice: formatLocalPricing(
                      getDiscountedPricing(pricing),
                      { maximumFractionDigits: 0 }
                    ),
                    yearlyPricing: formatLocalPricing(
                      getYearlyPricing(pricing)
                    ),
                  })}
                </Text>
              )}
            </div>
          </>
          <div className="col align-center w-100">
            <div className="button-width">
              <AuraButton
                loading={isProcessing}
                cleanStyle
                withShadow
                textWeight="bold"
                title={t('upsell_fp_button_complete_order')}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: 65,
                  borderRadius: 99,
                }}
                onClick={() => {
                  handlePayment();
                }}
                experiments={experiments}
              />
            </div>
            {trial !== '0' && (
              <Text
                type="footnote"
                color="b64"
                align="center"
                style={{ position: 'relative', marginTop: 20 }}>
                {t('upsell_fp_remind_you')}
              </Text>
            )}
          </div>
          <Text
            onClick={() => {
              handleRedirect();
            }}
            type="body2"
            color="b100"
            align="left"
            style={{
              marginTop: 18,
              textDecoration: 'underline',
              position: 'relative',
              cursor: 'pointer',
            }}>
            {t('upsell_fp_button_not_now')}
          </Text>
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
          <Text
            type="footnote"
            color="b64"
            align="center"
            style={{ maxWidth: 300, marginBottom: 12, marginTop: 15 }}>
            <Trans
              ns="upsell"
              i18nKey="upsell_fp_how_to_cancel"
              values={{
                description: t(pricing.descriptionFee, {
                  yearlyPricing: formatLocalPricing(getYearlyPricing(pricing)),
                }),
              }}
              components={[
                <a
                  key="cancelEmail"
                  href="mailto:hello@aurahealth.io"
                  style={{
                    textDecoration: 'none',
                    color: 'rgba(255,255,255,0.64)',
                  }}></a>,
              ]}
            />
          </Text>
        </div>
      )}

      <style jsx>{styles}</style>
    </div>
  );
}
