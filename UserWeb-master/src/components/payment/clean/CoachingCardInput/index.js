import React, { useRef } from 'react';
import classNames from 'classnames';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
} from '@stripe/react-stripe-js';
import styles from './styles';
import useCardInput from '../../../../hooks/cardInput';
import useThemeListener from '../../../../hooks/themeListener';

export default function CoachingCardInput({
  disabled,
  isUsedInCommunityPayment,
}) {
  const stripe = useStripe();
  const { isDark } = useThemeListener();
  const expiryRef = useRef(null);
  const cvcRef = useRef(null);

  const { handleChange } = useCardInput();

  const cardStyles = isDark
    ? {
        style: {
          base: {
            color: '#fff',
            fontSize: '16px',
            '::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
      }
    : {
        style: {
          base: {
            color: isUsedInCommunityPayment ? '#2F3237' : '#4E545F',
            fontSize: '16px',
            '::placeholder': {
              color: isUsedInCommunityPayment ? '#9092A3' : '#aab7c4',
            },
          },
        },
      };

  return (
    stripe && (
      <div style={{ width: '100%' }}>
        <div
          className={classNames('row card-input-coaching w-100', {
            'card-input-community': isUsedInCommunityPayment,
          })}>
          {isUsedInCommunityPayment && (
            <img
              src="/static/icons/heroicons-solid_credit-card.svg"
              alt=""
              style={{ marginRight: 4, height: 25, width: 'auto' }}
            />
          )}
          <div
            style={{
              width: '59%',
            }}>
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
              options={{ disabled, ...cardStyles }}
            />
          </div>
          <div style={{ width: '24%' }}>
            <CardExpiryElement
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
              onReady={(element) => {
                expiryRef.current = element;
              }}
            />
          </div>
          <div style={{ width: '13%' }}>
            <CardCvcElement
              onChange={(evt) => {
                handleChange({
                  type: 'cardCVV',
                  error: evt.error,
                  completed: evt.complete,
                });
              }}
              options={{ disabled, ...cardStyles }}
              onReady={(element) => {
                cvcRef.current = element;
              }}
            />
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    )
  );
}
