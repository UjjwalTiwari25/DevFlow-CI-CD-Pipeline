import React from 'react';
import Text from '../../../app/Text';
import styles from './styles';

export default function ReviewCard({ isFixed }) {
  return (
    <div className="box">
      <img
        src="/static/images/appleGoogleReviews/stars_5.png"
        alt="aura stars"
        className="stars"
      />
      <Text
        type="body2"
        color="b100"
        style={{ lineHeight: '17.05px', maxWidth: isFixed && 277 }}>
        {isFixed
          ? `Aura’s live group classes have transformed my life - I love connecting
        live with the coaches & the community and deepening my self-care
        practice.`
          : 'Aura is like having a therapist, personal life coach, guru & sleep buddy all wrapped into one. Aura allowed me to find myself & believe in who I am again'}
      </Text>
      <div className="row user-container align-center">
        <img
          src="/static/images/testimonial/linda.png"
          className="user-image"
          alt="aura user"
        />
        <div>
          <Text type="cta" weight="semibold" color="b100">
            Linda
          </Text>
          <Text type="footnote" color="b64" style={{ marginTop: 2 }}>
            Aura member for two years
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
