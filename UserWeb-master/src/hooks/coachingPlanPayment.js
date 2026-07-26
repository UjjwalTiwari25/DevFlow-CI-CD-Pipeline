import { CardNumberElement, useElements } from '@stripe/react-stripe-js';
import { useCallback, useReducer } from 'react';
import { subscribe } from '@/models/payment';
import { createPaymentMetadata } from '@/store/slices/payment';
import { useDispatch } from 'react-redux';
import Logger from '../services/Logger';
import useToastMessage from './toastMessage';
import paymentConstants from '../utils/constants/payment';
import useAuthUser from './authUser';
import useShallowEqualSelector from './shallowEqualSelector';
import { notifyHandledError } from '../services/ErrorMonitoring';
import useTranslations from './translations';

const initialState = {
  paymentRequest: null,
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

export default function useCoachingPlanPayment({
  onSuccessfulCharge,
  coachId,
  stripe,
}) {
  const { t } = useTranslations();
  const Toast = useToastMessage();
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchRedux = useDispatch();
  const { paymentRequest, canShowPaymentRequest, showUserError, loading } =
    state;
  const stripeElements = useElements();
  const { user } = useAuthUser();
  const { id: userId } = user || {};
  const { selectedPlan } = useShallowEqualSelector(({ coaching }) => coaching);

  const { stripePlanId, id: packageId } = selectedPlan || {};

  const processCharge = useCallback(
    async ({ tokenData }) => {
      const paymentMetaData = await dispatchRedux(
        createPaymentMetadata()
      ).unwrap();
      const { referralCode, referralType } = paymentMetaData;
      const data = {
        coachId,
        packageId,
        userId,
        referralCode,
        referralType,
        stripePlan: stripePlanId,
        token: tokenData && tokenData.token.id,
      };
      const response = await subscribe(data);
      if (!response || response.error) {
        dispatch({ type: 'setUserError', data: true });
        dispatch({ type: 'setLoading', data: false });
        Toast.showError(t('toast_error_failed_to_purchase_plan'));
      } else {
        onSuccessfulCharge();
      }
    },
    [coachId, packageId, userId, stripePlanId, Toast, onSuccessfulCharge]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedPlan) {
      Toast.showError(t('toast_error_no_plan_selected'));
      return;
    }
    if (!user || !user.id) {
      Toast.showError(t('toast_error_no_account'));
      return;
    }
    if (!stripe) {
      Logger.info(`Payment service hasn't loaded yet.`);
      return;
    }
    dispatch({ type: 'setLoading', data: true });

    const card = stripeElements.getElement(CardNumberElement);
    try {
      const authorization = await stripe.createToken(card);
      if (!authorization || authorization.error) {
        Toast.showError(
          authorization?.error?.message ||
            t('stripe_error_token_generation_failed')
        );
        dispatch({ type: 'setLoading', data: false });
        return;
      }
      await processCharge({
        paymentMethodType: paymentConstants.PAYMENT_METHOD_CARD,
        tokenData: authorization,
      });
    } catch (error) {
      notifyHandledError(error, { message: 'Failed to authorize card' });
      Toast.showError(t('stripe_error_token_generation_failed'));
      dispatch({ type: 'setLoading', data: false });
    }
  }, [selectedPlan, user, stripe, stripeElements, Toast, processCharge]);

  return {
    handleSubmit,
    paymentRequest,
    canShowPaymentRequest,
    showUserError,
    loading,
  };
}
