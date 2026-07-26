import { CardNumberElement, useElements } from '@stripe/react-stripe-js';
import { useCallback, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import Logger from '../services/Logger';
import useToastMessage from './toastMessage';
import { processCoachingSessionCharge } from '../store/slices/payment';
import paymentConstants from '../utils/constants/payment';
import useAuthUser from './authUser';
import useShallowEqualSelector from './shallowEqualSelector';
import { notifyHandledError } from '../services/ErrorMonitoring';

const initialState = {
  paymentRequest: null,
  applePay: false,
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

export default function useCoachingPayment({
  onSuccessfulCharge,
  paymentSource,
  coachId,
  amount,
  stripe,
}) {
  const { appointment, coachService } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );
  const {
    duration,
    sessionTypeId,
    serviceId,
    id: appointmentId,
    start: scheduledAt,
  } = appointment || {};
  const { title } = coachService || {};
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    paymentRequest,
    canShowPaymentRequest,
    applePay,
    showUserError,
    loading,
  } = state;
  const dispatchRedux = useDispatch();
  const stripeElements = useElements();
  const { user } = useAuthUser();

  const processCharge = useCallback(
    async ({ tokenData, paymentMethodType }) => {
      const response = await dispatchRedux(
        processCoachingSessionCharge({
          token: tokenData && tokenData.token.id,
          paymentMethodType,
          appointmentId,
          coachId,
          paymentSource: paymentSource && paymentSource,
          amount,
          description: `[Coaching-Session] Payment for ${duration} minutes of 1-1 coaching session on ${title}`,
          sessionTypeId,
          serviceId,
          scheduledAt,
        })
      ).unwrap();
      if (!response || response.error) {
        dispatch({ type: 'setUserError', data: true });
      } else {
        onSuccessfulCharge();
      }
    },
    [
      dispatchRedux,
      appointmentId,
      coachId,
      paymentSource,
      amount,
      title,
      sessionTypeId,
      serviceId,
      scheduledAt,
      onSuccessfulCharge,
      duration,
    ]
  );

  const handleSubmit = useCallback(
    async (isNewCard) => {
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
      if (paymentSource && !isNewCard) {
        await processCharge({
          coachId,
          paymentSource,
          paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
        });
      } else {
        const card = stripeElements.getElement(CardNumberElement);
        try {
          const authorization = await stripe.createToken(card);
          if (!authorization || authorization.error) {
            dispatch({ type: 'setUserError', data: true });
            return;
          }
          await processCharge({
            paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
            tokenData: authorization,
          });
        } catch (error) {
          notifyHandledError(error, { message: 'Failed to authorize card' });
          dispatch({ type: 'setUserError', data: true });
        }
      }
    },
    [user, stripe, paymentSource, Toast, processCharge, coachId, stripeElements]
  );

  return {
    handleSubmit,
    paymentRequest,
    canShowPaymentRequest,
    applePay,
    showUserError,
    loading,
  };
}
