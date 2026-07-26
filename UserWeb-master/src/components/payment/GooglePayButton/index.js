import React from 'react';
import styles from './styles';

export default function GooglePayButton({ onClick, disabled, title, style }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...style,
      }}
      className="google-pay-button clickable font custom-font"
      disabled={disabled}
      type="button">
      {title && <span>{title}</span>}
      <img src="/static/icons/googlePay.png" alt="Google Pay" />
      <style jsx>{styles}</style>
    </button>
  );
}
