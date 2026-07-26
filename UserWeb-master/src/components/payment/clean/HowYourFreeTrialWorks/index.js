import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function HowYourFreeTrialWorks({
  setTotalPrice,
  setMarginTop,
  setMarginBottom,
  pricing,
}) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  const getHeaderText = () => {
    if (setTotalPrice) {
      return 'payment_subscribe_trial_works_how_trial_works';
    }
    return 'payment_subscribe_trial_works_free_trial_works';
  };

  return (
    <div
      className={classNames('card', {
        'low-opacity': isDark,
        'margin-top': setMarginTop,
        'margin-bottom': setMarginBottom,
      })}>
      <div className="full-width-center">
        <Text
          type="h3"
          color="b100"
          align="center"
          weight="semibold"
          style={{ maxWidth: 235 }}>
          {t(getHeaderText())}
        </Text>
      </div>

      <div className="relative row free-trial-container">
        <img
          src={'/static/images/freeTrial.png'}
          alt="aura free trial"
          className="free-trial"
        />
        <div className="content-container">
          <div className="relative hr-container">
            <Text
              type="h4"
              align="left"
              weight="semibold"
              color="b100"
              style={{
                background: 'linear-gradient(to right, #1DF5ED, #4CCAFF) text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                marginTop: 6,
              }}>
              {t('payment_subscribe_trial_works_create_account')}
            </Text>
          </div>
          <Text
            type="body2"
            color="b40"
            align="left"
            style={{ lineHeight: '18.9px', maxWidth: 220, marginTop: 4 }}>
            {t('payment_subscribe_trial_works_created_profile')}
          </Text>
          <Text
            type="h4"
            color="b100"
            align="left"
            weight="semibold"
            style={{
              marginTop: 24,
            }}>
            {t('payment_subscribe_trial_works_instant_access')}
          </Text>
          <Text
            type="body2"
            color="b80"
            align="left"
            style={{ lineHeight: '18.9px', maxWidth: 220, marginTop: 4 }}>
            {t('payment_subscribe_trial_works_premium_content_access')}
          </Text>
          <Text
            type="h4"
            color="b100"
            weight="semibold"
            align="left"
            style={{
              marginTop: 26,
            }}>
            {pricing?.trial === 30
              ? t('payment_subscribe_trial_works_month_reminder')
              : t('payment_subscribe_trial_works_trial_reminder')}
          </Text>
          <Text
            type="body2"
            color="b80"
            align="left"
            style={{
              lineHeight: '18.9px',
              maxWidth: 220,
              marginTop: 4,
            }}>
            {t('payment_subscribe_trial_works_get_a_reminder')}
          </Text>
          <Text
            type="h4"
            color="b100"
            weight="semibold"
            align="left"
            style={{
              marginTop: 32,
            }}>
            {pricing?.trial === 30
              ? t('payment_subscribe_trial_works_month_trial_ends')
              : t('payment_subscribe_trial_works_trial_ends')}
          </Text>
          <Text
            type="body2"
            color="b80"
            align="left"
            style={{ lineHeight: '18.9px', maxWidth: 220, marginTop: 4 }}>
            {t('payment_subscribe_trial_works_charged_today')}
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
