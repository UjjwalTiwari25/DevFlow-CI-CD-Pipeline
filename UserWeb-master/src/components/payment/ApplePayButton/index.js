import React from 'react';
import classNames from 'classnames';
import AppleLogo from './AppleLogo';
import styles from './styles';

export default function ApplePayButton({
  onClick,
  disabled,
  title,
  style,
  hideAppleLogo,
  appleColor = '#000',
}) {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
      }}
      className="apple-pay-button clickable font custom-font"
      disabled={disabled}
      type="button">
      {title && (
        <span
          className={classNames({
            'apple-pay-button-title-exp': hideAppleLogo,
            'apple-pay-button-title': !hideAppleLogo,
          })}>
          {title}
        </span>
      )}
      {!hideAppleLogo && <AppleLogo appleColor={appleColor} />}
      <style jsx>{styles}</style>
    </button>
  );
}
