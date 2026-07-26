import React from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function SupportOthers({
  isCoaching,
  className,
  isNoTopPadding,
}) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  return (
    <div
      className={classNames('card', className, {
        'low-opacity': isDark,
        'is-no-top-padding': isNoTopPadding,
      })}
      style={{ background: isCoaching && 'none' }}>
      <img
        src="/static/images/icons/support-others.png"
        className="support-others"
        alt="support"
      />
      <div>
        <Text type="body" color={isDark ? 'b100' : 'g100'} align="left">
          {t('payment_subscribe_support_others')}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
