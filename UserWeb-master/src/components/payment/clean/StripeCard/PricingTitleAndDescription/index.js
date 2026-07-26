import React from 'react';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import useTranslations from '@/hooks/translations';
import { Trans } from 'react-i18next';
import {
  getDiscountedPricing,
  getPricingForDuration,
  getYearlyPricing,
  getDiscount,
} from '@/models/payment';
import Text from '../../../../app/Text';
import pricingConstants from '../../../../../utils/constants/pricing';

export default function PricingTitleAndDescription({
  pricing,
  isDarkMode,
  setTotalPrice,
  fee,
  isCoaching,
  showPaymentProviders,
}) {
  const { t } = useTranslations();

  const { formatLocalPricing } = useConvertPriceInLocalCurrency();
  return (
    <>
      {pricing.trial === 0 ? (
        <Text
          type="h3"
          color={isDarkMode ? 'b100' : 'g100'}
          align="center"
          weight="semibold"
          style={{
            whiteSpace: 'pre-wrap',
            marginTop: showPaymentProviders ? 8 : 0,
          }}>
          {t(pricing.title, {
            fee: formatLocalPricing(getDiscountedPricing(pricing)),
          })}
        </Text>
      ) : (
        <Text
          type="h3"
          color={isDarkMode ? 'b100' : 'g100'}
          align="center"
          weight="semibold"
          style={{
            whiteSpace: 'pre-wrap',
            marginTop: showPaymentProviders ? 8 : 0,
          }}>
          {setTotalPrice
            ? t(`payment_subscribe_total_due_today`, {
                fee: formatLocalPricing(fee),
              })
            : t(pricing.title, {
                fee: formatLocalPricing(0),
              })}
        </Text>
      )}

      {(pricingConstants.PRICING_DEFAULT === pricing.id ||
        pricingConstants.PRICING_YEARLY_5999_7DAYS === pricing.id ||
        pricingConstants.PRICING_YEARLY_7999_7DAYS === pricing.id ||
        pricingConstants.PRICING_YEARLY_8999_7DAYS === pricing.id) && (
        <Text
          type="footnote"
          color={isDarkMode ? 'b70' : 'g70'}
          align="center"
          style={
            !showPaymentProviders
              ? {
                  whiteSpace: 'pre-wrap',
                  marginTop: 16,
                  lineHeight: '15px',
                }
              : {
                  whiteSpace: 'pre-wrap',
                  lineHeight: '17px',
                }
          }>
          {t('payment_subscribe_pricing_details', {
            status: setTotalPrice ? '' : ` ${t('price_text_free')}`,
            yearlyPricing: formatLocalPricing(getDiscountedPricing(pricing)),
            monthlyPricing: formatLocalPricing(getPricingForDuration(pricing)),
          })}
        </Text>
      )}
      {!isCoaching &&
        getDiscount(pricing) > 0 &&
        pricing.showDiscountSubtitle && (
          <Text
            type={!showPaymentProviders ? 'body' : 'footnote'}
            color={!showPaymentProviders ? 'b100' : 'b70'}
            align={!showPaymentProviders ? 'left' : 'center'}
            style={
              !showPaymentProviders
                ? {
                    whiteSpace: 'pre-wrap',
                    marginTop: 12,
                    lineHeight: '16px',
                  }
                : {
                    whiteSpace: 'pre-wrap',
                    lineHeight: '17px',
                  }
            }>
            <Trans
              ns="subscribe"
              i18nKey={'payment_subscribe_subtitle_discount_header'}
              values={{
                yearlyPricing: formatLocalPricing(getYearlyPricing(pricing)),
                monthlyPricing: formatLocalPricing(
                  getPricingForDuration(pricing)
                ),
                discountedPricing: formatLocalPricing(
                  getDiscountedPricing(pricing)
                ),
              }}
              components={[
                <span
                  key="crossedPricing"
                  style={{
                    fontWeight: '700',
                    color: '#FF3B30',
                    textDecoration: 'line-through',
                  }}
                />,
              ]}
            />
          </Text>
        )}
    </>
  );
}
