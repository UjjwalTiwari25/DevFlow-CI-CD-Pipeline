import React from 'react';
import Text from '../../../../app/Text';
import styles from './styles';

export default function DailyAccess() {
  return (
    <div className="main w-100">
      <div className="col align-center">
        <img
          src="/static/images/joinlist/cass.png"
          alt="aura coach cass"
          className="coach-image"
        />
        <Text type="body" color="b100" align="center" style={{ marginTop: 10 }}>
          Your Coach
        </Text>
      </div>
      <div className="row chat-wrapper">
        <img
          src="/static/images/joinlist/cass.png"
          alt="aura coach cass"
          className="coach-image-small"
        />
        <div className="chat-box-white">
          <Text color="b100" style={{ fontSize: 11 }}>
            How are you doing with your goals this week?
          </Text>
        </div>
      </div>
      <div className="row right-row">
        <div className="chat-box-blue">
          <Text color="b100" style={{ fontSize: 11 }}>
            I’m having trouble calming my anxiety before work. Can you talk me
            through how I should approach this?
          </Text>
        </div>
      </div>
      <div className="row">
        <img
          src="/static/images/joinlist/cass.png"
          alt="aura coach cass"
          className="coach-image-small"
        />
        <div className="relative">
          <img
            src="/static/images/joinlist/cass.png"
            alt="aura coach cass"
            className="coach-image-play"
          />
          <div className="polygone-container row justify-center align-center">
            <img
              src="/static/images/newCoach/polygon.png"
              alt="aura"
              className="polygone"
            />
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
