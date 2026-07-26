import { CardNumberElement, useElements } from '@stripe/react-stripe-js';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getDiscountedPricing } from '@/models/payment';
import Logger from '../services/Logger';
import usePageQuery from './pageQuery';
import useToastMessage from './toastMessage';
import {
  processedPayment,
  authorizeStripeToken,
  handleProcessSubscription,
  checkoutSubscription,
} from '../store/slices/payment';
import paymentConstants from '../utils/constants/payment';
import useShallowEqualSelector from './shallowEqualSelector';
import useAuthUser from './authUser';
import {
  isUserCoachingSubscriber,
  isUserContentSubscriber,
} from '../models/user';
import { notifyHandledError } from '../services/ErrorMonitoring';
import FbPixel from '../services/FbPixel';
import TiktokPixel from '../services/TiktokPixel';
import useTranslations from './translations';
import DECLINE_CODES from '../data/cardDeclineErrors.json';

const initialState = {
  paymentRequest: null,
  canShowPaymentRequest: false,
  applePay: false,
  googlePay: false,
  showUserError: false,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setPaymentRequest':
      return { ...state, ...action.data };
    case 'setUserError':
      return { ...state, showUserError: action.data };
    case 'setLoading':
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

export default function useStripeCard({
  showQuickCheckout,
  onSuccessfulSubscription,
  onFailedSubscription,
  onSubmitEmail,
  stripe,
  fee,
  setTotalPrice,
  sourcePlatform,
}) {
  const { t } = useTranslations();
  const email = useRef('');
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const stripeErrors = Object.values(DECLINE_CODES);

  const {
    paymentRequest,
    canShowPaymentRequest,
    applePay,
    googlePay,
    showUserError,
    loading,
  } = state;
  const dispatchRedux = useDispatch();
  const stripeElements = useElements();
  const { referralCode = null } = usePageQuery({
    fetchUserFromQuery: true,
  });
  const { user } = useAuthUser();
  const { pricing, isCoaching } = useShallowEqualSelector(
    ({ payment }) => payment
  );
  const handleError = useCallback(
    (error, showToast) => {
      dispatch({ type: 'setLoading', data: false });
      Logger.info(error?.message || 'Stripe Card Error', { error });
      if (error && error.message) {
        if (showToast) {
          Toast.showError(error.message);
        }
      } else if (showToast) {
        Toast.showError();
      }
      if (typeof onFailedSubscription === 'function') {
        onFailedSubscription({
          error: error?.message,
          errorCode: error?.code,
        });
      }
    },
    [Toast, dispatch, onFailedSubscription]
  );

  useEffect(() => {
    if (!stripe || !showQuickCheckout || !pricing) return undefined;

    // Rebuild the payment request whenever pricing changes. Reset first: a
    // rebuild that can't produce a valid Apple/Google Pay request (e.g. a $0
    // free trial) must NOT leave the previous plan's request still marked
    // available — otherwise the CTA fires a stale/mismatched sheet instead of
    // falling back to the card modal. That stuck-flag was why the 1-month
    // button did nothing for returning users until a hard reload.
    dispatch({
      type: 'setPaymentRequest',
      data: { canShowPaymentRequest: false, paymentRequest: null },
    });

    // Amount due today, in cents:
    //  - no trial            → the full price is charged now
    //  - explicit fee (web)  → the fee the caller passed
    //  - intro-fee plan      → the plan's own trialFee (e.g. 1-month $4.99),
    //                          derived from pricing so the webview needn't pass it
    //  - free trial          → $0 (handled below: no request, card modal only)
    const discountedPricing = getDiscountedPricing(pricing);
    let amount = 0;
    if (pricing.trial === 0) {
      amount = Math.trunc(discountedPricing * 100);
    } else if (setTotalPrice && fee) {
      amount = Math.trunc(parseFloat(fee) * 100);
    } else if (pricing.trialFee) {
      const introFee = parseFloat(
        String(pricing.trialFee).replace(/[^0-9.]/g, '')
      );
      amount = Number.isFinite(introFee) ? Math.trunc(introFee * 100) : 0;
    }

    // Apple/Google Pay can't authorize a $0 total (free trial) — skip the
    // request so the CTA falls back to the Stripe card modal.
    if (!amount || amount <= 0) return undefined;

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Aura Premium Subscription',
        amount,
      },
      requestPayerName: false,
      requestPayerEmail: false,
    });
    // Guard against a stale async result from a previous plan clobbering the
    // current state after a rapid plan switch.
    let cancelled = false;
    pr.canMakePayment().then((result) => {
      if (result && !cancelled) {
        dispatch({
          type: 'setPaymentRequest',
          data: {
            canShowPaymentRequest: true,
            paymentRequest: pr,
            applePay: result.applePay,
            googlePay: result.googlePay,
          },
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pricing, dispatch, showQuickCheckout, stripe, fee, setTotalPrice]);

  const onChangeEmail = useCallback((evt) => {
    email.current = evt.target.value?.trim();
    dispatch({
      type: 'setUserError',
      data: false,
    });
  }, []);

  const onSubmitEmailInput = useCallback(() => {
    dispatch({
      type: 'setUserError',
      data: false,
    });
    onSubmitEmail(email.current);
  }, [onSubmitEmail]);

  const handleAuthorization = useCallback(
    async (tokenData, paymentMethodType) => {
      if (tokenData && tokenData.token && tokenData.token.id) {
        const response = await dispatchRedux(
          authorizeStripeToken({
            token: tokenData.token.id,
            paymentMethodType,
          })
        ).unwrap();
        if (!response) {
          handleError({ message: t('stripe_error_failed_to_authorize') }, true);
          dispatchRedux(processedPayment());
          return null;
        }
        const { error, customer, message, errorCode } = response;
        if (error) {
          const errorDetails = stripeErrors.find((err) => {
            return err.name === errorCode;
          });
          let errorMessage = message;
          if (errorDetails) errorMessage = errorDetails.description;
          if (paymentMethodType === paymentConstants.PAYMENT_METHOD_APPLE_PAY) {
            Logger.warn('Apple Pay authorization failed', {
              error,
              errorMessage,
            });
          }
          handleError({ message: t(errorMessage) }, true);
          dispatchRedux(processedPayment());
          return null;
        }
        return { customer };
      }
      handleError(tokenData.error, true);
      dispatchRedux(processedPayment());
      return null;
    },
    [dispatchRedux, handleError, stripeErrors, t]
  );

  const processSubscription = useCallback(
    async ({ customer, isAuthorized, paymentMethodType, tokenData }) => {
      const response = await dispatchRedux(
        handleProcessSubscription({
          token: tokenData.token.id,
          customerId: customer,
          paymentMethodType,
          isAuthorized,
          sourcePlatform,
        })
      ).unwrap();
      if (
        !response ||
        response.error ||
        !response.status ||
        (response.status !== 'active' && response.status !== 'trialing')
      ) {
        if (typeof tokenData.complete === 'function') {
          tokenData.complete('fail');
        }
        Toast.showError(t('stripe_error_failed_to_process'));
        if (typeof onFailedSubscription === 'function') {
          onFailedSubscription({
            error: response?.error || 'subscription_processing_failed',
            errorCode: response?.errorCode,
            status: response?.status,
          });
        }
      } else {
        if (typeof tokenData.complete === 'function') {
          tokenData.complete('success');
        }
        if (typeof onSuccessfulSubscription === 'function')
          onSuccessfulSubscription(paymentMethodType, {
            subscriptionId: response?.id,
            status: response?.status,
          });
      }
    },
    [
      dispatchRedux,
      Toast,
      t,
      onSuccessfulSubscription,
      onFailedSubscription,
      sourcePlatform,
    ]
  );

  const validateUser = useCallback(() => {
    if (!user || !user.id) {
      Toast.showError(t('stripe_error_no_account_found'));
      return false;
    }
    if (!isCoaching && isUserContentSubscriber(user)) {
      Toast.showError(t('stripe_error_already_subscribed'));
      return false;
    }
    if (isCoaching && isUserCoachingSubscriber(user)) {
      Toast.showError(t('stripe_error_subscribed_to_coaching'));
      return false;
    }
    if (user.referralCode === referralCode) {
      Toast.showError(t('stripe_error_referring_yourself'));
      return false;
    }
    if (!stripe) {
      Logger.info(`Payment service hasn't loaded yet.`);
      Toast.showError();
      return false;
    }
    return true;
  }, [user, t, isCoaching, referralCode, stripe, Toast]);

  const handleSubmit = useCallback(
    async (evt) => {
      if (evt) {
        evt.preventDefault();
      }
      if (!validateUser()) {
        return;
      }
      dispatch({ type: 'setLoading', data: true });
      FbPixel.trackStandard('InitiateCheckout', {}, { user });
      TiktokPixel.trackStandard('InitiateCheckout', {
        content_id: user?.id,
        content_category: 'content',
      });
      const card = stripeElements.getElement(CardNumberElement);
      try {
        const authorization = await stripe.createToken(card);
        if (!authorization || authorization.error) {
          let message = t('stripe_error_token_generation_failed');
          if (authorization.error) {
            message = authorization.error.message;
          }

          handleError({ message }, true);
          return;
        }

        let response;
        await dispatchRedux(
          checkoutSubscription(paymentConstants.PAYMENT_METHOD_CARD)
        );
        if (pricing.trial) {
          response = await handleAuthorization(
            authorization,
            paymentConstants.PAYMENT_METHOD_CARD
          );
          if (!response) {
            return;
          }
        }
        await processSubscription({
          customer: response?.customer || null,
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
          tokenData: authorization,
          isAuthorized: !!response,
        });
      } catch (error) {
        notifyHandledError(error, {
          message: 'Failed to authorize card',
        });
        handleError(error, true);
      }
    },
    [
      validateUser,
      stripe,
      stripeElements,
      t,
      dispatchRedux,
      pricing?.trial,
      processSubscription,
      handleError,
      handleAuthorization,
    ]
  );

  const handlePaymentRequestSubmit = useCallback(
    async (evt) => {
      if (evt) {
        evt.preventDefault();
      }
      if (!validateUser()) {
        return;
      }
      if (!paymentRequest) {
        Logger.warn('Payment request not created');
        return;
      }
      Logger.audit('Showing payment request', {
        // eslint-disable-next-line no-underscore-dangle
        callbacks: JSON.stringify(paymentRequest._callbacks || {}),
      });
      paymentRequest.show();
    },
    [validateUser, paymentRequest]
  );

  useEffect(() => {
    if (!paymentRequest) return () => {};

    let isProcessing = false;

    const tokenHandler = async (data) => {
      if (isProcessing) {
        Logger.audit('Payment request already in progress', {
          token: data?.token,
          pricing,
        });
        return;
      }
      try {
        Logger.audit('Payment request processing started', {
          token: data?.token,
          pricing,
        });
        isProcessing = true;
        const paymentMethodType = applePay
          ? paymentConstants.PAYMENT_METHOD_APPLE_PAY
          : paymentConstants.PAYMENT_METHOD_GOOGLE_PAY;

        let response;
        await dispatchRedux(checkoutSubscription(paymentMethodType));
        if (pricing.trial) {
          Logger.audit('Payment request authorization started', {
            token: data?.token,
            pricing,
          });
          response = await handleAuthorization(data, paymentMethodType);
          if (!response) {
            Logger.audit('Payment request authorization failed', {
              token: data?.token,
              pricing,
            });
            if (typeof data.complete === 'function') {
              data.complete('fail');
            }
            return;
          }
        }
        Logger.audit('Payment request subscription started', {
          token: data?.token,
          pricing,
        });
        await processSubscription({
          customer: response?.customer || null,
          paymentMethodType,
          tokenData: data,
          isAuthorized: !!response,
        });
        Logger.audit('Payment request subscription completed', {
          token: data?.token,
          pricing,
        });
      } finally {
        isProcessing = false;
      }
    };

    const cancelHandler = () => {
      Logger.audit('Payment request cancelled');
      dispatchRedux(processedPayment());
      Toast.showError(t('stripe_error_payment_request_cancelled'));
      isProcessing = false;
      // Mirror native parity: on iOS, the IAP sheet cancel fires
      // `Subscription purchase fail`. Surface the cancel as a failure so the
      // mobile bridge can emit the matching synthetic event (PROD-1571).
      if (typeof onFailedSubscription === 'function') {
        onFailedSubscription({
          error: 'payment_request_cancelled',
          errorCode: 'user_cancelled',
        });
      }
    };

    Logger.debug(`Setting up payment request listeners `, {
      // eslint-disable-next-line no-underscore-dangle
      callbacks: JSON.stringify(paymentRequest._callbacks),
    });
    paymentRequest.on('token', tokenHandler);
    paymentRequest.on('cancel', cancelHandler);

    return () => {
      Logger.debug(`Clearing up payment request listeners `, {
        // eslint-disable-next-line no-underscore-dangle
        callbacks: JSON.stringify(paymentRequest._callbacks),
      });
      paymentRequest.off('token', tokenHandler);
      paymentRequest.off('cancel', cancelHandler);
    };
  }, [
    paymentRequest,
    applePay,
    dispatchRedux,
    pricing?.trial,
    handleAuthorization,
    processSubscription,
    Toast,
    t,
    onFailedSubscription,
  ]);

  return {
    handlePaymentRequestSubmit,
    handleSubmit,
    onChangeEmail,
    onSubmitEmailInput,
    paymentRequest,
    canShowPaymentRequest,
    applePay,
    googlePay,
    showUserError,
    loading,
  };
}
