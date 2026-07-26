import React from 'react';
import Text from '../app/Text';

export default function Testimonial() {
  return (
    <div className="testimonial-container">
      <Text
        type="h4"
        component="h1"
        align="center"
        color="b100"
        weight="regular"
        style={{
          marginTop: 72,
        }}>
        Trusted by over 4 million members
      </Text>

      <div id="testimonial" className="component-shadow">
        <img
          src="/static/images/5stars.png"
          alt="Rated 5 stars"
          style={{
            height: 16,
            objectFit: 'contain',
            marginRight: 8,
          }}
        />

        <Text
          type="subtitle"
          weight="regular"
          color="b100"
          align="center"
          style={{ marginTop: 16, marginBottom: 16 }}>
          {`Aura is like having a therapist, personal life coach, guru & sleep
          buddy all wrapped into one. Aura allowed me to find myself & believe
          in who I am again.`}
        </Text>
        <Text type="subtitle" weight="regular" color="b64" align="center">
          - Linda, Aura member for 2 years
        </Text>
      </div>
      <style jsx>{`
        .video-player {
          border-radius: 12px;
          width: 240px;
          margin-top: 16px;
        }
        .play-button {
          cursor: pointer;
          position: absolute;
          margin-left: auto;
          margin-right: auto;
          left: 0;
          top: 50%;
          right: 0;
          text-align: center;
          width: 40px;
          height: 40px;
        }
        .testimonial-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        #testimonial {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          border-radius: 16px;
          padding: 24px;
          width: 90%;
          margin: 16px;
          margin-bottom: 16px;
        }
        @media (max-width: 320px) {
          .video-player {
            width: 180px;
          }
        }
      `}</style>
    </div>
  );
}
