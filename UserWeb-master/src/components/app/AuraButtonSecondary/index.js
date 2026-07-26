import React from 'react';
import classnames from 'classnames';
import Text from '../Text';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';
import Loader from '../Loader';

export default function AuraButtonSecondary({
  title,
  onClick,
  style,
  disabled,
  loading,
  hideShadow,
  textStyle,
  classes,
  type,
  textWeight,
}) {
  const { isDark } = useThemeListener();

  const textColor = isDark ? 'w100' : 'b100';
  return (
    <button
      className={classnames(
        'aura-btn',
        {
          'btn-disabled': disabled,
          'no-select': disabled,
          'btn-shadow': !hideShadow,
        },
        classes
      )}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      type={type}>
      {loading ? (
        <Loader size={24} color="white" style={{ height: '100%' }} />
      ) : (
        <Text
          color={disabled ? 'w100' : textColor}
          type="h4"
          weight={textWeight || 'semibold'}
          align="center"
          style={textStyle}>
          {title}
        </Text>
      )}
      <style jsx>{styles}</style>
    </button>
  );
}
