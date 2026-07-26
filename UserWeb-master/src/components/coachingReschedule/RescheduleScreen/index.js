import { format, isToday, isTomorrow } from 'date-fns';
import React from 'react';
import AuraButtonSecondary from '../../app/AuraButtonSecondary';
import Text from '../../app/Text';
import styles from './styles';
import AppointmentCoachDetail from '../AppointmentCoachDetail';

export default function RescheduleScreen({
  handleCancelAppointment,
  coach,
  appointmentDetails,
  handleRescheduleAppointment,
}) {
  const { start, duration } = appointmentDetails;
  function getDay(date) {
    if (isToday(new Date(date))) {
      return 'Today';
    }
    if (isTomorrow(new Date(date))) {
      return 'Tomorrow';
    }
    return '';
  }
  return (
    <div className="col align-center w-100">
      <div className="col align-center container-main">
        <img
          src="/static/images/reschedule/resched-background.png"
          alt="aura background"
          className="aura-background"
        />
        <div className="col align-center container">
          <AppointmentCoachDetail
            coach={coach}
            appointmentDetails={appointmentDetails}
          />
          <Text
            type="body"
            color="g100"
            align="center"
            style={{ marginTop: 24, maxWidth: 300 }}>
            {appointmentDetails &&
              `${
                appointmentDetails && format(new Date(start), 'MMMM dd')
              }, ${getDay()}`}{' '}
            {format(new Date(start), 'h:mm a')} (
            {Intl?.DateTimeFormat().resolvedOptions().timeZone || null}){' '}
            {duration} min
          </Text>
          <div className="relative">
            <img
              src="/static/images/reschedule/call-cancel-bg.png"
              alt="aura bg"
              className="bg-call-cancel"
            />
            <div className="cancel-container">
              <Text
                type="h3"
                color="g100"
                weight="regular"
                align="center"
                style={{ maxWidth: 286, lineHeight: '30px' }}>
                Cancel/Reschedule Booking
              </Text>
              <Text
                type="body2"
                color="g100"
                weight="semibold"
                align="left"
                style={{ maxWidth: 261, lineHeight: '17px', marginTop: 24 }}>
                Please cancel/reschedule at least 24 hours before your booking
                to give your coach a notice.
              </Text>
              <AuraButtonSecondary
                hideShadow
                title="Reschedule booking"
                style={{
                  width: '100%',
                  marginTop: 28,
                  boxShadow: '0px 12px 50px rgba(43, 42, 107, 0.1)',
                }}
                onClick={() => {
                  handleRescheduleAppointment();
                }}
              />
              <AuraButtonSecondary
                hideShadow
                title="Cancel Booking"
                style={{
                  width: '100%',
                  marginTop: 14,
                  boxShadow: '0px 12px 50px rgba(43, 42, 107, 0.1)',
                }}
                textStyle={{ color: '#FF3B30', fontWeight: 400 }}
                onClick={() => {
                  handleCancelAppointment();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
