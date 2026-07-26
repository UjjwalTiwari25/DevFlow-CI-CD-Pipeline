import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import AuraRingClean from '../../app/AuraRingClean';
import Text from '../../app/Text';
import styles from './styles';

export default function Header({
  title,
  subtitle,
  center = false,
  isCoaching = false,
  titleMaxWidth,
  onSkip,
  isShowSkip,
  smallSubtitle,
  isModalSignup,
  titleTextStyle = {},
}) {
  const { t } = useTranslations();

  return (
    <Fragment>
      <AuraRingClean
        style={{
          marginTop: 4,
          marginLeft: -14,
        }}
        size={76}
      />
      {isShowSkip && (
        <div className="skip-text clickable" onClick={onSkip}>
          <Text
            type="h4"
            color="b100"
            weight="semibold"
            style={{
              lineHeight: '22px',
              textDecoration: 'underline',
              textDecorationColor: `rgba(255, 255, 255, 0.2)`,
            }}>
            {t('onboarding_button_skip')}
          </Text>
        </div>
      )}
      <div>
        {title && (
          <Text
            type="h3"
            color="b100"
            component="h1"
            weight="semibold"
            align={center ? 'center' : 'left'}
            style={{
              fontSize: isModalSignup && '20px',
              lineHeight: isModalSignup && '24px',
              marginTop: 12,
              maxWidth: titleMaxWidth || 'none',
              whiteSpace: 'pre-wrap',
              ...titleTextStyle,
            }}>
            {title}
          </Text>
        )}
      </div>
      {subtitle && (
        <Text
          type={'body'}
          color={'b64'}
          align={isCoaching ? 'center' : 'left'}
          style={{
            marginTop: 12,
            fontSize: smallSubtitle && '15px',
            whiteSpace: 'pre-wrap',
          }}>
          {subtitle}
        </Text>
      )}
      <style jsx>{styles}</style>
    </Fragment>
  );
}
