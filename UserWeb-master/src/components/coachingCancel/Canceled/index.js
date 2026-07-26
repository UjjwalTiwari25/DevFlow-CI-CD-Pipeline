import React from 'react';
import useBrowserHistory from '../../../hooks/browserHistory';
import Text from '../../app/Text';
import styles from './styles';
import AppointmentCoachDetail from '../../coachingReschedule/AppointmentCoachDetail';

export default function Canceled({
  onNext,
  onBack,
  coach,
  appointmentDetails,
}) {
  useBrowserHistory('canceled', true, onBack, onNext);
  return (
    <div className="col align-center container">
      <AppointmentCoachDetail
        coach={coach}
        appointmentDetails={appointmentDetails}
      />
      <img
        src="/static/images/reschedule/check.png"
        alt="aura"
        className="check"
      />

      <Text type="h3" color="g100">
        Successfully cancelled!
      </Text>
      <Text type="body2" color="g100" style={{ marginTop: 9 }}>
        You still can schedule a session in next 7 days.
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}
