import React from 'react';
import Text from '../../app/Text';
import styles from './styles';

export default function TherapistsCounter({ className, style }) {
  return (
    <div className={`${className}`}>
      <div className="card-short col" style={style}>
        <Text
          color="b100"
          type="h3"
          component="h1"
          weight="regular"
          align="left"
          style={{
            maxWidth: 214,
          }}>
          Full access to Apple Award-Winning Aura app
        </Text>

        <div className="counter-container">
          <div>
            <div className="tracks_counter">
              <Text type="h2" align="left" color="b100" weight="bold">
                1000+
              </Text>
            </div>
            <Text
              type="body"
              align="left"
              color="g100"
              weight="regular"
              style={{ maxWidth: 123 }}>
              tracks to use in your daily practice
            </Text>
          </div>
          <div>
            <div className="therapists_counter">
              <Text type="h2" align="left" color="b100" weight="bold">
                50+
              </Text>
            </div>
            <Text
              type="body"
              align="left"
              color="g100"
              weight="regular"
              style={{ maxWidth: 123 }}>
              therapists and coaches to guide you
            </Text>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    </div>
  );
}
