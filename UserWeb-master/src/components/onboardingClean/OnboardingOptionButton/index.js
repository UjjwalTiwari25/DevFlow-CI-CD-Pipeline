import classNames from 'classnames';
import React from 'react';
import Text from '../../app/Text';
import styles from './styles';

export default function OnboardingOptionButton({
  textAlign,
  title,
  onClick,
  leftIcon,
  style,
  type,
  textStyle,
  isActive,
  colorfulClick,
  dataTestId,
  rigthIcon,
  className,
}) {
  return (
    <div
      id="btn-card"
      data-testid={dataTestId}
      className={classNames('button-shadow clickable', className, {
        'select-border-blue': isActive,
        'rainbow-color': isActive && colorfulClick,
        'rainbow-button-shadow': colorfulClick,
      })}
      onClick={onClick}
      style={style}>
      {leftIcon}
      <Text
        type={type || 'body'}
        align={textAlign || 'center'}
        weight="semibold"
        color="g100"
        style={{ maxWidth: '90%', ...textStyle }}>
        {title}
      </Text>
      {rigthIcon}
      <style jsx>{styles}</style>
    </div>
  );
}
