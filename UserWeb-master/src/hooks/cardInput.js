import { useCallback, useReducer } from 'react';
import Logger from '../services/Logger';
import useToastMessage from './toastMessage';

const initialState = {
  cardNumberError: false,
  cardCVVError: '',
  cardExpiryError: '',
  cardNumberComplete: false,
  cardCVVComplete: false,
  cardExpiryComplete: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setCardNumber':
      return {
        ...state,
        cardNumberError: action.error,
        cardNumberComplete: action.complete,
      };
    case 'setCardCVV':
      return {
        ...state,
        cardCVVError: action.error,
        cardCVVComplete: action.complete,
      };
    case 'setCardExpiry':
      return {
        ...state,
        cardExpiryError: action.error,
        cardExpiryComplete: action.complete,
      };
    default:
      return state;
  }
}

export default function useCardInput() {
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    cardNumberError,
    cardCVVError,
    cardExpiryError,
    cardNumberComplete,
    cardCVVComplete,
    cardExpiryComplete,
  } = state;

  const handleError = useCallback(
    (error, showToast) => {
      Logger.debug(error.message, { error });
      if (error) {
        switch (error.code) {
          case 'incomplete_number':
          case 'invalid_number':
            dispatch({
              type: 'setCardNumberError',
              data: true,
            });
            break;
          case 'incomplete_expiry':
          case 'invalid_expiry_year_past':
          case 'invalid_expiry_month_past':
          case 'invalid_expiry_year':
            dispatch({
              type: 'setCardExpiryError',
              data: true,
            });
            break;
          case 'incomplete_cvc':
            dispatch({
              type: 'setCardCVVError',
              data: true,
            });
            break;
          default:
            break;
        }
        if (showToast) {
          Toast.showError(error.message);
        }
      } else if (showToast) {
        Toast.showError();
      }
    },
    [Toast]
  );

  const handleChange = useCallback(
    ({ type, error, completed }) => {
      if (error) {
        handleError(error, false);
      } else {
        switch (type) {
          case 'cardNumber':
            dispatch({
              type: 'setCardNumber',
              error: false,
              complete: completed,
            });
            break;
          case 'cardCVV':
            dispatch({
              type: 'setCardCVV',
              error: false,
              complete: completed,
            });
            break;
          case 'cardExpiry':
            dispatch({
              type: 'setCardExpiry',
              error: false,
              complete: completed,
            });
            break;
          default:
            break;
        }
      }
    },
    [handleError]
  );

  return {
    handleChange,
    handleError,
    cardNumberError,
    cardCVVError,
    cardExpiryError,
    cardNumberComplete,
    cardCVVComplete,
    cardExpiryComplete,
  };
}
