import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function MoneyBackGuarantee() {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  return (
    <div
      className={classNames('card', {
        'low-opacity': isDark,
      })}>
      <div className="circle">
        <div className="icon">
          <img
            src="/static/images/guarantee1.png"
            className="guarantee1"
            alt="support"
          />
          <img
            src="/static/images/guarantee2.png"
            className="guarantee2"
            alt="support"
          />
        </div>
      </div>

      <div>
        <Text
          type="h4-large"
          color={isDark ? 'b100' : 'g100'}
          align="center"
          weight="semibold"
          style={{ marginTop: 12, marginBottom: 12, lineHeight: '24px' }}>
          {t('payment_subscribe_money_back_guarantee_30_day')}
        </Text>
        <Text
          type="body"
          color={isDark ? 'b100' : 'g100'}
          align="center"
          style={{ lineHeight: '16px' }}>
          {t('payment_subscribe_money_back_guarantee_not_happy')}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
