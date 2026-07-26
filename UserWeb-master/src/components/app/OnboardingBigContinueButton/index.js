import React from 'react';
import classnames from 'classnames';
import Text from '../Text';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';
import Loader from '../Loader';

export default function OnboardingBigContinueButton({
  excludeTestId,
  title,
  onClick,
  style,
  disabled,
  loading,
  hideShadow,
  textStyle,
  classes,
  isNewDesignSystem,
}) {
  const { isDark } = useThemeListener();
  const isDarkColor = isDark ? 'w100' : 'b100';
  const textColor = isNewDesignSystem ? '#2F3237' : isDarkColor;

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
      data-testid={!excludeTestId ? 'continueButton' : null}
      style={style}>
      {loading ? (
        <Loader size={24} color="white" style={{ height: '100%' }} />
      ) : (
        <Text
          color={disabled ? 'w100' : textColor}
          type="h4"
          weight="semibold"
          align="center"
          style={textStyle}>
          {title}
        </Text>
      )}
      <style jsx>{styles}</style>
    </button>
  );
}
