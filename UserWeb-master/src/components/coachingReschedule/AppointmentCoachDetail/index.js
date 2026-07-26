import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../models/coach';
import { SESSISON_NAMES } from '../../../utils';
import Text from '../../app/Text';
import styles from './styles';

export default function AppointmentCoachDetail({ coach, appointmentDetails }) {
  const { sessionTypeId } = appointmentDetails;
  return (
    <>
      <div className="coach-container row align-center justify-center">
        <img
          src={getCoachPhoto(coach)}
          alt="aura coach"
          className="coach-image"
        />
        <img
          src="/static/images/reschedule/rainbow.png"
          alt="aura coach"
          className="rainbow"
        />
      </div>
      <div className="col session-info">
        <Text type="cta" color="b100" weight="semibold">
          {SESSISON_NAMES[sessionTypeId]} Session
        </Text>
        <Text
          type="body"
          color="b100"
          weight="regular"
          style={{ marginTop: 2, marginBottom: 18 }}>
          with {getCoachName(coach)}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
