import React from 'react';
import useBrowserHistory from '../../../hooks/browserHistory';
import AuraButton from '../../app/AuraButton';
import AuraButtonSecondary from '../../app/AuraButtonSecondary';
import Text from '../../app/Text';
import styles from './styles';
import AppointmentCoachDetail from '../../coachingReschedule/AppointmentCoachDetail';

export default function CancelBooking({
  onNext,
  onBack,
  handleRedirect,
  appointmentDetails,
  coach,
}) {
  useBrowserHistory('resceduleScreen', true, onBack, onNext);
  return (
    <div className="col align-center container">
      <AppointmentCoachDetail
        coach={coach}
        appointmentDetails={appointmentDetails}
      />

      <Text type="cta" color="g100" style={{ marginTop: 16 }}>
        {appointmentDetails.duration} min
      </Text>
      <Text type="h3" color="g100" style={{ marginTop: 46 }}>
        Cancel Booking
      </Text>
      <div className="relative">
        <img
          src="/static/images/reschedule/call-cancel-bg.png"
          alt="aura bg"
          className="bg-call-cancel"
        />
        <div className="cancel-container col align-center">
          <img
            src="/static/images/reschedule/cancel-info-icon.png"
            alt="aura icon"
            className="cancel-info-icon"
          />

          <Text
            type="body"
            color="g100"
            align="center"
            style={{ maxWidth: 261, lineHeight: '17px', marginTop: 24 }}>
            {`If you don't have time, you can just reschedule the session. It's
            easy.`}
          </Text>
          <AuraButton
            cleanStyle
            hideShadow
            textWeight="bold"
            title="Reschedule"
            style={{
              width: '100%',
              marginTop: 28,
            }}
            onClick={() => {
              handleRedirect();
            }}
          />
        </div>
      </div>
      <div className="cancel-button">
        <AuraButtonSecondary
          hideShadow
          title="Cancel Booking"
          style={{
            width: '100%',
            marginTop: 14,
            boxShadow: '0px 12px 50px rgba(43, 42, 107, 0.1)',
          }}
          textStyle={{ color: '#FF3B30' }}
          onClick={() => {
            onNext();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
