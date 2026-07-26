import React from 'react';
import { getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

export default function ComplementaryCall({ coach }) {
  return (
    <div className={`main-container`}>
      <Text type="h4" weight="normal" color="b100">
        5. Complementary 30-min live onboarding call
      </Text>
      <div className="call-container">
        <img
          src="/static/images/coachplan/coach-call.png"
          alt="coach"
          width="100%"
          className="phone"
        />
        <div className="person-vector">
          <img
            src="/static/images/coachplan/person-vector.png"
            alt="person"
            width={49}
          />
          <Text
            type="body2"
            color="w100"
            align="center"
            weight="bold"
            style={{ marginTop: 5 }}>
            You
          </Text>
        </div>
        <img
          src={coach && getCoachPhoto(coach)}
          alt="coach"
          className="coach-image"
        />
      </div>
      <hr
        style={{
          margin: 0,
          backgroundColor: '#9092A3',
          height: 2,
          border: 'none',
        }}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
