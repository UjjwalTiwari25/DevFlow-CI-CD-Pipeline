import React from 'react';
import { getCoachFirstName } from '../../../models/coach';
import Text from '../../app/Text';
import styles from './styles';

function About({ coach, isMobile }) {
  const { bio, specialties } = coach;
  return (
    <div className="col align-center w-100">
      <div className="about col">
        {specialties && (
          <Text
            type={isMobile ? 'body2' : 'h2-small'}
            color="b100"
            weight="regular">
            {getCoachFirstName(coach)} Specialities
          </Text>
        )}
        <div className="specialities row">
          {specialties &&
            specialties.split(',').map((speciality) => (
              <div className="speciality" key={speciality}>
                <Text type="footnote" color="b100">
                  {speciality}
                </Text>
              </div>
            ))}
        </div>
        {bio && (
          <Text
            type={isMobile ? 'body' : 'h2-small'}
            weight="regular"
            color="b100"
            style={{ marginTop: 30 }}>
            Biography
          </Text>
        )}
        <Text
          type="body2"
          color="b64"
          style={{ lineHeight: '21px', marginTop: 15 }}>
          {bio}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default About;
