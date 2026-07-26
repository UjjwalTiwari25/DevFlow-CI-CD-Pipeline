import React, { useEffect, useState } from 'react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useDispatch } from 'react-redux';
import Text from '../../app/Text';
import styles from './styles';
import useBrowserHistory from '../../../hooks/browserHistory';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import AuraButton from '../../app/AuraButton';
import { rescheduleAppointment } from '../../../models/service';
import useToastMessage from '../../../hooks/toastMessage';
import { createdCoachAppointment } from '../../../store/slices/coaching';
import Analytics from '../../../services/Analytics';
import useAuthUser from '../../../hooks/authUser';
import AppointmentCoachDetail from '../AppointmentCoachDetail';

export default function ConfirmRescheduleTime({
  coach,
  onNext,
  onBack,
  appointmentDetails,
}) {
  useBrowserHistory('confirmRescheduleTime', true, onBack, onNext);
  const { selectedTime } = useShallowEqualSelector(({ coaching }) => coaching);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthUser();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const Toast = useToastMessage();
  const dispatch = useDispatch();
  async function handleClick() {
    setLoading(true);
    const rescheduleData = {
      appointmentId: appointmentDetails.id,
      start: selectedTime.start,
    };
    const res = await rescheduleAppointment(rescheduleData);
    if (res && !res.error) {
      setLoading(false);
      dispatch(createdCoachAppointment(res));
      Analytics.track('Appointment Rescheduled', {
        userId: user?.id,
        appointmentId: res.id,
        coachId: coach?.id,
      });
      onNext();
    } else {
      setLoading(false);
      Toast.showError('Rescheduling Appointment Failed');
    }
  }
  return (
    <div className="coach-row-info col align-center">
      <AppointmentCoachDetail coach={coach} appointmentDetails={selectedTime} />

      <Text type="body" color="g100" align="center" style={{ marginTop: 16 }}>
        {appointmentDetails.duration} min
      </Text>
      <Text
        type="h3"
        color="g100"
        align="center"
        style={{ marginTop: 54, marginBottom: 48 }}>
        Reschedule Booking
      </Text>
      <Text type="body2" color="g50" align="center">
        Session Date
      </Text>
      <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
        {selectedTime &&
          `${
            selectedTime && format(new Date(selectedTime.start), 'MMMM dd')
          }, ${isToday(new Date(selectedTime.start)) ? 'Today' : ''} ${
            isTomorrow(new Date(selectedTime.start)) ? 'Tomorrow' : ''
          }`}
      </Text>
      <Text type="body2" color="g50" align="center" style={{ marginTop: 34 }}>
        Session Time
      </Text>
      <Text type="body" color="g100" align="center" style={{ marginTop: 3 }}>
        {selectedTime && format(new Date(selectedTime.start), 'h:mm')} -{' '}
        {selectedTime && format(new Date(selectedTime.end), 'h:mm a')} (
        {Intl?.DateTimeFormat().resolvedOptions().timeZone || null})
      </Text>
      <AuraButton
        cleanStyle
        title="Confirm"
        textWeight="bold"
        withShadow
        loading={loading}
        style={{ marginTop: 70, width: '100%', height: 72, borderRadius: 99 }}
        onClick={() => {
          handleClick();
        }}
      />
      <div className="clickable cancel-button" onClick={onBack}>
        <Text
          type="cta"
          color="b100"
          style={{
            textDecoration: 'underline',
            textDecorationColor: 'rgba(0,0,0,0.2)',
            textUnderlineOffset: '4px',
          }}>
          Cancel
        </Text>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
