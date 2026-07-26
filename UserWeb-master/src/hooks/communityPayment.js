import { CardNumberElement, useElements } from '@stripe/react-stripe-js';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { checkExistingCard, setDefaultPaymentSource } from '@/models/payment';
import {
  processCommunitySubscription,
  setCommunity,
} from '@/store/slices/payment';
import Logger from '../services/Logger';
import useToastMessage from './toastMessage';
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

export default function useCommunityPayment({
  community,
  stripe,
  onSuccessfulPurchase,
}) {
  const [activeCard, setActiveCard] = useState(null);
  const [customer, setCustomer] = useState(null);
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const { showUserError, isProcessing } = state;
  const stripeElements = useElements();
  const { user } = useAuthUser();

  useEffect(() => {
    dispatchRedux(setCommunity(community));
  }, [community]);

  const onCardChange = (cardDetails) => {
    setActiveCard(cardDetails);
  };

  const canMakePayment =
    activeCard?.complete ||
    activeCard?.default ||
    activeCard?.expired === false;

  const handleProcessCommunitySubscription = useCallback(
    async ({ tokenData }) => {
      if (activeCard && !canMakePayment) {
        dispatch({ type: 'setUserError', data: true });
        Toast.showError('Failed to subscribe to community');
      }

      const response = await dispatchRedux(
        processCommunitySubscription({ tokenData })
      ).unwrap();

      if (!response || response.error) {
        dispatch({ type: 'setUserError', data: true });
        Toast.showError('Failed to subscribe to community');
      } else {
        onSuccessfulPurchase();
      }
    },
    [community, user, Toast, onSuccessfulPurchase, activeCard]
  );

  const getCustomer = async () => {
    try {
      const customerDetails = await checkExistingCard();

      if (!customerDetails?.valid) {
        setCustomer(null);
        setActiveCard(null);
        return;
      }

      const defaultCard = customerDetails?.cards?.find((c) => c.default);

      setCustomer(customerDetails);
      if (defaultCard) {
        setActiveCard(defaultCard);
      }
    } catch (error) {
      notifyHandledError(error, { message: 'Failed to set default card' });
      Toast.showError('Failed to set default card');
      dispatch({ type: 'setLoading', data: false });
    }
  };

  useEffect(() => {
    getCustomer();
  }, [user]);

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
      if (activeCard?.id) {
        await setDefaultPaymentSource({ paymentSource: activeCard.id });
        await handleProcessCommunitySubscription({
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
          stripePlan: community.stripeProductId,
          userId: user?.id,
          communityId: community.id,
          ownerId: community.ownerId,
        });
      } else {
        const card = stripeElements.getElement(CardNumberElement);
        const authorization = await stripe.createToken(card);
        if (!authorization || authorization.error) {
          Toast.showError(
            authorization?.error?.message || 'Failed to generate token'
          );
          dispatch({ type: 'setLoading', data: false });
          return;
        }
        await handleProcessCommunitySubscription({
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
          tokenData: authorization,
        });
      }
    } catch (error) {
      notifyHandledError(error, { message: 'Failed to authorize card' });
      Toast.showError('Failed to generate token');
      dispatch({ type: 'setLoading', data: false });
    }
  }, [user, stripe, stripeElements, Toast, handleProcessCommunitySubscription]);

  return {
    handleSubmit,
    showUserError,
    isProcessing,
    onCardChange,
    activeCard,
    cards: customer?.cards,
    isCardSavedToFile: customer?.valid,
  };
}
