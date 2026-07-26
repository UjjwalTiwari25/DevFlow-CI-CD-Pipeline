import React from 'react';
import classNames from 'classnames';
import Text from '../Text';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';
import Loader from '../Loader';

export default function AuraButton({
  title,
  subTitle,
  onClick,
  style,
  disabled,
  loading,
  withShadow,
  withNewShadow,
  textStyle,
  textWeight = 'regular',
  classes,
  cleanStyle,
  disableLowOpacity,
  isGreenCta,
  isGreenCtaExp,
  isWhiteCta,
  horizontalGradient,
  blinking,
}) {
  const { isDark } = useThemeListener();
  return (
    <button
      className={
        classes ||
        classNames('aura-btn', {
          'btn-disabled': disabled,
          'no-select': disabled && !disableLowOpacity,
          'btn-shadow': !disabled && withShadow,
          'new-btn-shadow': !disabled && withNewShadow,
          'clean-style': cleanStyle && !disabled,
          'btn-disabled-low-opacity': disableLowOpacity,
          'green-btn': isGreenCta && !isGreenCtaExp,
          'green-btn-exp': isGreenCta && isGreenCtaExp,
          'white-btn': isWhiteCta,
          'horizontal-gradient': horizontalGradient,
          'aura-btn-blinking': blinking,
        })
      }
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...style, ...cleanStyle }}>
      {loading ? (
        <Loader size={24} color="white" style={{ height: '100%' }} />
      ) : (
        <div className="btn-text-container">
          <Text
            color={isDark ? 'b100' : 'w100'}
            type="body"
            weight={textWeight}
            align="center"
            style={textStyle}>
            {title}
          </Text>
          {subTitle && (
            <Text
              color={isDark ? 'b100' : 'w100'}
              type="body2"
              weight="semibold"
              align="center"
              style={{ marginTop: 2 }}>
              {subTitle}
            </Text>
          )}
        </div>
      )}
      <style jsx>{styles}</style>
    </button>
  );
}
