import React, { useCallback, useEffect, useRef } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import classNames from 'classnames';
import styles from './styles';
import useCardInput from '../../../../hooks/cardInput';
import useThemeListener from '../../../../hooks/themeListener';

export default function CardInput({ disabled, autoFocus }) {
  const stripe = useStripe();
  const elements = useElements();
  const { isDark } = useThemeListener();
  const { handleChange, cardNumberError, cardCVVError, cardExpiryError } =
    useCardInput();
  const expiryRef = useRef(null);
  const cvcRef = useRef(null);

  const placeholderNumber = 'XXXX XXXX XXXX XXXX';

  useEffect(() => {
    if (elements && autoFocus) {
      const cardElement = elements.getElement(CardNumberElement);
      if (cardElement) {
        setTimeout(() => {
          cardElement.focus(); // autofocus safely after a small delay to render the card number field
        }, 500);
      }
    }
  }, [elements, autoFocus]);

  const placeholderStyles = useCallback(() => {
    if (isDark) {
      return {
        style: {
          base: {
            color: '#fff',
            fontSize: '16px',
            '::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
      };
    }
    return {
      style: {
        base: {
          color: '#4E545F',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    };
  }, [isDark]);

  const cardStyles = placeholderStyles();

  return (
    stripe && (
      <div style={{ width: '100%' }}>
        <div>
          <div
            className={classNames({
              'card-input-dark': isDark,
              'card-input': !isDark,
              error: cardNumberError,
            })}>
            <div className="width100">
              <CardNumberElement
                onChange={(evt) => {
                  handleChange({
                    type: 'cardNumber',
                    error: evt.error,
                    completed: evt.complete,
                  });
                  if (evt.complete && expiryRef.current) {
                    expiryRef.current.focus();
                  }
                }}
                options={{
                  disabled,
                  placeholder: placeholderNumber,
                  ...cardStyles,
                }}
              />
            </div>
          </div>
          <div className="card-details">
            <div
              className={classNames('card-detail-input', {
                'card-input-dark': isDark,
                'card-input': !isDark,
                error: cardExpiryError,
              })}>
              <div className="width100">
                <CardExpiryElement
                  onReady={(element) => {
                    expiryRef.current = element;
                  }}
                  onChange={(evt) => {
                    handleChange({
                      type: 'cardExpiry',
                      error: evt.error,
                      completed: evt.complete,
                    });
                    if (evt.complete && cvcRef.current) {
                      cvcRef.current.focus();
                    }
                  }}
                  options={{ disabled, ...cardStyles }}
                />
              </div>
            </div>
            <div
              className={classNames('card-detail-input', {
                'card-input-dark': isDark,
                'card-input': !isDark,
                error: cardCVVError,
              })}>
              <div className="width100">
                <CardCvcElement
                  onReady={(element) => {
                    cvcRef.current = element;
                  }}
                  onChange={(evt) =>
                    handleChange({
                      type: 'cardCVV',
                      error: evt.error,
                      completed: evt.complete,
                    })
                  }
                  options={{
                    disabled,
                    placeholder: 'CVC / CVV',
                    ...cardStyles,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  );
}
