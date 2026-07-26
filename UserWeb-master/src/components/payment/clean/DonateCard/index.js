import React from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function DonateCard({ isCoaching }) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  return (
    <div
      className={classNames('card', {
        'low-opacity': isDark,
      })}
      style={{ background: isCoaching && 'none' }}>
      <img
        src="/static/images/icons/donate.png"
        className="support-others"
        alt="Donate"
      />
      <div>
        <Text type="body" color={isDark ? 'b100' : 'g100'} align="left">
          {t('payment_subscribe_donate_percentage')}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
