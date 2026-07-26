import { CardNumberElement, useElements } from '@stripe/react-stripe-js';
import { useCallback, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { bookEvent } from '@/models/event';
import { pollCommunityUserSubscriptionExists } from '@/models/user';
import Logger from '../services/Logger';
import useToastMessage from './toastMessage';
import {
  processCommunitySubscription,
  processPaymentIntent,
  setCommunity,
  setEvent,
} from '../store/slices/payment';
import paymentConstants from '../utils/constants/payment';
import useAuthUser from './authUser';
import { notifyHandledError } from '../services/ErrorMonitoring';

const initialState = {
  showUserError: false,
  isProcessing: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setUserError':
      return { ...state, showUserError: action.data };
    case 'setLoading':
      return { ...state, isProcessing: action.data };
    default:
      return state;
  }
}

export default function useEventPayment({
  amount,
  event,
  community,
  stripe,
  onSuccessfulPurchase,
  onSubscriptionPollFail,
  eventPaymentType,
}) {
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showUserError, isProcessing } = state;
  const dispatchRedux = useDispatch();
  const stripeElements = useElements();
  const { user } = useAuthUser();

  useEffect(() => {
    dispatchRedux(setCommunity(community));
  }, [community]);

  useEffect(() => {
    dispatchRedux(setEvent(event));
  }, [event]);

  const processEventPayment = useCallback(async () => {
    const response = await dispatchRedux(
      processPaymentIntent({
        amount,
        feature: 'event',
        stripe,
        stripeElements,
      })
    ).unwrap();

    if (!response || response.error) {
      dispatch({ type: 'setUserError', data: true });
      Toast.showError('Failed to process event payment');
      return;
    }
    onSuccessfulPurchase();
  }, [
    dispatchRedux,
    user?.id,
    event,
    stripe,
    stripeElements,
    amount,
    onSuccessfulPurchase,
    Toast,
    eventPaymentType,
  ]);

  const handleProcessCommunitySubscription = useCallback(
    async ({ tokenData }) => {
      try {
        const response = await dispatchRedux(
          processCommunitySubscription({ tokenData })
        ).unwrap();

        if (!response || response.error) {
          dispatch({ type: 'setUserError', data: true });
          Toast.showError('Failed to subscribe to community');
        }

        const pollResult = await pollCommunityUserSubscriptionExists(
          user?.id,
          community?.id
        );

        if (pollResult && !pollResult.error) {
          return true;
        }
        onSubscriptionPollFail();
        Toast.showError(
          'Your community subscription has been applied but event purchase failed. Please try again to purchase the event.'
        );
        return false;
      } catch (error) {
        Logger.error('Error processing community subscription:', error);
        onSubscriptionPollFail();
        Toast.showError(
          'Your community subscription has been applied but event purchase failed. Please try again to purchase the event.'
        );
        return false;
      }
    },
    [dispatchRedux, user?.id, community?.id, Toast, onSubscriptionPollFail]
  );

  const getStripeAuthToken = async () => {
    let authorization;
    try {
      const card = stripeElements.getElement(CardNumberElement);
      authorization = await stripe.createToken(card);
      if (!authorization || authorization.error) {
        Toast.showError(
          authorization?.error?.message || 'Failed to generate token'
        );
        dispatch({ type: 'setLoading', data: false });
      }
    } catch (error) {
      notifyHandledError(error, { message: 'Unable to generate token' });
    }
    return authorization;
  };

  const handleSubmit = useCallback(async () => {
    if (!user || !user.id) {
      Toast.showError('No account found!');
      return;
    }
    if (!stripe) {
      Logger.info(`Payment service hasn't loaded yet.`);
      Toast.showError();
      return;
    }
    dispatch({ type: 'setLoading', data: true });

    try {
      if (eventPaymentType === 'communityWithEvent') {
        const authorization = await getStripeAuthToken();
        if (!authorization) return;
        await handleProcessCommunitySubscription({
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
          tokenData: authorization,
        }).then(async (subscriptionSuccessful) => {
          if (!subscriptionSuccessful) return;
          if (event.communityPrice > 0) {
            await processEventPayment({
              paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
              tokenData: authorization,
            });
          } else if (!event.communityPrice) {
            await bookEvent(event.id)
              .then(() => {
                onSuccessfulPurchase();
              })
              .catch((error) => {
                notifyHandledError(error, { message: 'Failed to book event' });
                Toast.showError('Failed to book event');
              });
          }
        });
      } else if (eventPaymentType === 'community') {
        const authorization = await getStripeAuthToken();
        if (!authorization) return;
        await handleProcessCommunitySubscription({
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
          tokenData: authorization,
        }).then((subscriptionSuccessful) => {
          if (subscriptionSuccessful) {
            onSuccessfulPurchase();
          }
        });
      } else if (eventPaymentType === 'event') {
        if (amount === 0) {
          await bookEvent(event.id)
            .then(() => {
              onSuccessfulPurchase();
            })
            .catch((error) => {
              notifyHandledError(error, { message: 'Failed to book event' });
              Toast.showError('Failed to book event');
            });
          dispatch({ type: 'setLoading', data: false });
        } else {
          const authorization = await getStripeAuthToken();
          if (!authorization) return;
          await processEventPayment({
            paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
            tokenData: authorization,
          });
        }
      }
    } catch (error) {
      notifyHandledError(error, { message: 'Failed to authorize card' });
      Toast.showError('Failed to generate token');
    } finally {
      dispatch({ type: 'setLoading', data: false });
    }
  }, [
    user,
    stripe,
    stripeElements,
    Toast,
    processEventPayment,
    handleProcessCommunitySubscription,
    eventPaymentType,
    event?.communityPrice,
    amount,
  ]);

  return {
    handleSubmit,
    showUserError,
    isProcessing,
  };
}
