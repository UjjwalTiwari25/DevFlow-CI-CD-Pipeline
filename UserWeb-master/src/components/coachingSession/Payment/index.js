import React, { useEffect, useMemo, useRef, useState } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import classNames from 'classnames';
import { useStripe } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import useToastMessage from '@/hooks/toastMessage';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../hooks/browserHistory';
import PaymentModal from '../PaymentModal';
import { checkExistingCard } from '../../../models/payment';
import useAuthUser from '../../../hooks/authUser';
import AuraButton from '../../app/AuraButton';
import useCoachingPayment from '../../../hooks/coachingPayment';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import AuraRingClean from '../../app/AuraRingClean';
import CoachingCardInput from '../../payment/clean/CoachingCardInput';
import useInterval from '../../../hooks/interval';
import LocalStorage from '../../../services/LocalStorage';
import TimeoutModal from '../TimeoutModal';
import Analytics from '../../../services/Analytics';
import { confirmAppointment } from '../../../models/service';
import schedulingConstants from '../../../utils/constants/scheduling';
import { updateUserProfile } from '../../../store/slices/auth';

const {
  SESSION_TYPES: { FREE_SERVICE_INDIVIDUAL, FREE_DISCOVERY },
} = schedulingConstants;

export default function Payment({ coach, onNext, onBack }) {
  useBrowserHistory('coachingSessionPayment', true, onBack, onNext);
  const { coachService, selectedDuration, selectedTime, appointment } =
    useShallowEqualSelector(({ coaching }) => coaching);
  const [minutes, setMinutes] = useState(null);
  const [seconds, setSeconds] = useState(null);
  const [price, setPrice] = useState(null);
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  const { showError } = useToastMessage();
  const { isProcessing } = useShallowEqualSelector(({ payment }) => payment);
  const [existingCard, setExistingCard] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const stripe = useStripe();
  const paymentModalRef = useRef(null);
  const timeoutModal = useRef(null);
  const isApplePay = false;
  const isFreeSession =
    (appointment && appointment.sessionTypeId === FREE_SERVICE_INDIVIDUAL) ||
    (appointment && appointment.sessionTypeId === FREE_DISCOVERY);

  const { handleSubmit, showUserError } = useCoachingPayment({
    coachId: coach.id,
    amount: price,
    paymentSource: (existingCard && existingCard.cards[0].id) || undefined,
    stripe,
    onSuccessfulCharge: () => {
      onNext();
    },
  });
  useEffect(() => {
    const localMinutes = LocalStorage.getItem('APPOINTMENT_COUNT_DOWN_MINUTES');
    const localSeconds = LocalStorage.getItem('APPOINTMENT_COUNT_DOWN_SECONDS');
    setMinutes(localMinutes);
    setSeconds(localSeconds);
  }, []);

  useEffect(() => {
    Analytics.track('Coaching Session Payment Page View', {
      SelectedDuration: selectedDuration,
      SelectedTime: selectedTime,
      ServiceId: coachService?.id,
      ServiceName: coachService?.title,
      CoachId: coach && coach.id,
      CoachName: getCoachName(coach),
      UserId: user && user.id,
    });
  }, []);

  useMemo(() => {
    if (coachService && coachService?.pricing) {
      setPrice(
        coachService.pricing.find((i) => {
          return i.duration === selectedDuration;
        }).price
      );
    }
  }, [coachService, selectedDuration]);

  useInterval(
    () => {
      if (seconds > 0) {
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_SECONDS', seconds);
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_MINUTES', minutes);
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_SECONDS', 59);
        LocalStorage.setItem('APPOINTMENT_COUNT_DOWN_MINUTES', minutes - 1);
        setSeconds(59);
        setMinutes(minutes - 1);
      }
    },
    minutes === 0 && seconds === 0 ? null : 1000
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        paymentModalRef &&
        paymentModalRef.current &&
        !existingCard &&
        showUserError
      ) {
        paymentModalRef.current.show();
      }
    }, 1000);
  }, [existingCard, showUserError]);

  function showPaymentModal() {
    if (paymentModalRef && paymentModalRef.current) {
      paymentModalRef.current.show();
    }
  }

  function showTimeOutModal() {
    if (timeoutModal && timeoutModal.current) {
      timeoutModal.current.show();
    }
  }
  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      showTimeOutModal();
    }
  }, [minutes, seconds]);
  useEffect(() => {
    async function fetchExistingCard() {
      const res = await checkExistingCard();
      if (res.valid) {
        setExistingCard(res);
      }
      setLoading(false);
    }
    if (!existingCard) {
      fetchExistingCard();
    }
  }, [existingCard, user]);

  async function confirm() {
    setLoading(true);
    const {
      id: appointmentId,
      serviceId,
      start: scheduledAt,
      sessionTypeId,
    } = appointment || {};
    const response = await confirmAppointment(appointmentId);
    if (response && !response.error) {
      if (sessionTypeId !== FREE_DISCOVERY) {
        await dispatch(
          updateUserProfile({
            profile: {
              webCoachingSessionPurchase: {
                appointmentId,
                coachId: coach?.id,
                scheduledAt,
                serviceId,
              },
            },
            id: user?.id,
            saveToDatabase: true,
          })
        );
      }
      onNext();
    } else {
      showError('Unable to confirm appointment');
    }
    setLoading(false);
  }

  return (
    <div className="coach-row-info col align-center">
      <img
        src={getCoachPhoto(coach)}
        alt={getCoachName(coach)}
        className="coach-photo"
      />
      <Text type="h4" color="g100" align="center" style={{ marginTop: 14 }}>
        {appointment && appointment.sessionTypeId === FREE_DISCOVERY
          ? `Discovery Call`
          : `Self-Compassion`}
      </Text>
      <Text type="body" color="g100" align="center" style={{ marginTop: 7 }}>
        with {getCoachName(coach)}
      </Text>
      <Text type="body2" color="g50" align="center" style={{ marginTop: 31 }}>
        Session Date
      </Text>
      <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
        {selectedTime &&
          `${format(
            new Date(selectedTime.start),
            'MMMM dd'
          )}${isToday(new Date(selectedTime.start)) ? ', Today' : ''}${
            isTomorrow(new Date(selectedTime.start)) ? ', Tomorrow' : ''
          }`}
      </Text>
      <Text type="body2" color="g50" align="center" style={{ marginTop: 14 }}>
        Session Time
      </Text>
      <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
        {selectedTime && format(new Date(selectedTime.start), 'h:mm')} -{' '}
        {selectedTime && format(new Date(selectedTime.end), 'h:mm a')} (
        {Intl?.DateTimeFormat().resolvedOptions().timeZone || null})
      </Text>
      <Text type="body2" color="g50" align="center" style={{ marginTop: 10 }}>
        Price
      </Text>
      {isFreeSession ? (
        <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
          Free
        </Text>
      ) : (
        <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
          ${price && price && price / 100}
        </Text>
      )}
      <img
        src="/static/images/coachingSession/payment-background-mobile.png"
        alt="aura background"
        className="payment-background-2"
      />
      <img
        src="/static/images/coachingSession/payment-background.png"
        alt="aura background"
        className="payment-background"
      />
      <div className="payment-options-container col align-center">
        <div
          className={classNames('payment-options col align-center', {
            'error-container': showUserError,
          })}>
          <img
            src="/static/images/coachingSession/greenCheck.png"
            alt="aura green check"
            className="green-check"
          />
          <Text
            type="body"
            align="center"
            color="b100"
            style={{ maxWidth: 200, marginTop: 10 }}>
            We reserved this time slot for you {minutes}:
            {`${seconds < 10 ? '0' : ''}${seconds}`}
          </Text>
          {!existingCard && isApplePay && !isLoading && (
            <>
              <img
                src="/static/images/coachingSession/appleCheckout.png"
                alt="aura green check"
                className="apple-check"
              />
              <div
                className="credit-btn row justify-center align-center clickable"
                onClick={() => {
                  showPaymentModal();
                }}>
                <Text type="body2" color="b100" align="center">
                  Buy with credit card.
                </Text>
              </div>
            </>
          )}
          {!existingCard && !isApplePay && !isLoading && (
            <>
              {!isFreeSession && (
                <div className="input-container">
                  <CoachingCardInput disabled={isProcessing} />
                </div>
              )}
              {isProcessing ? (
                <AuraRingClean size={60} />
              ) : (
                <AuraButton
                  cleanStyle
                  withShadow
                  textWeight="bold"
                  title="Complete Order"
                  style={{ marginTop: 12, height: 55, minWidth: '80%' }}
                  onClick={() => {
                    if (isFreeSession) {
                      confirm();
                    } else {
                      handleSubmit();
                    }
                  }}
                />
              )}
            </>
          )}
          {existingCard && existingCard.cards[0] && !isLoading && (
            <div className="existing-card-container col align-center">
              {!isFreeSession && (
                <Text type="footnote" color="g100" align="center">
                  Charge to your card ending in {existingCard.cards[0].last4}.{' '}
                  <span
                    className="change-card"
                    onClick={() => {
                      showPaymentModal();
                    }}>
                    Change
                  </span>
                </Text>
              )}
              {isProcessing ? (
                <AuraRingClean size={60} />
              ) : (
                <AuraButton
                  cleanStyle
                  withShadow
                  textWeight="bold"
                  title="Complete Order"
                  style={{ width: '100%', marginTop: 16 }}
                  onClick={() => {
                    if (isFreeSession) {
                      confirm();
                    } else {
                      handleSubmit();
                    }
                  }}
                />
              )}
            </div>
          )}
          {isLoading && <AuraRingClean size={60} />}
          {showUserError && (
            <Text type="body2" style={{ color: '#FF3B30', marginTop: 19 }}>
              Purchase error - please try again
            </Text>
          )}
          <img
            src="/static/images/coachingSession/secure.png"
            alt="aura green check"
            className="secure-check"
          />
        </div>
      </div>
      {existingCard && !isFreeSession && (
        <PaymentModal
          ref={paymentModalRef}
          onClick={() => {
            handleSubmit(true);
          }}
          isProcessing={isProcessing}
        />
      )}
      <TimeoutModal ref={timeoutModal} onBack={onBack} />
      <style jsx>{styles}</style>
    </div>
  );
}
