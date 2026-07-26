import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';

export default function PrivateInfo({ className, isCoaching }) {
  const { t } = useTranslations();
  return (
    <div
      className={`card ${className}`}
      style={{ background: isCoaching && 'none' }}>
      <div className="lock">
        <img
          src="/static/images/coachingOnboarding/icons/unlock.png"
          className="support-others"
          alt="lock"
        />
      </div>
      <div>
        <Text type="body" color="g100" align="center">
          {t('payment_subscribe_private_info')}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
