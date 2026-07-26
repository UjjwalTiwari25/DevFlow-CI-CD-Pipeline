import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

function OneOnOne({ coach }) {
  return (
    <div className="chat">
      <img
        src="/static/images/newCoach/daily-access-mobile.webp"
        alt="aura"
        className="mobile"
      />
      <img
        src="/static/images/newCoach/daily-access-mobile-background.png"
        alt="aura"
        className="mobile-background"
      />
      <div className="detail-container">
        <div className="coach-right row">
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-icon"
          />
          <div className="chat-box-white">
            <Text color="b100" type="footnote-small">
              How are you doing with your goals this week?
            </Text>
          </div>
        </div>
        <div className="right-container row">
          <div className="user-left">
            <Text color="w100" type="footnote-small">
              I’m having trouble calming my anxiety before work. Can you talk me
              through how I should approach this?
            </Text>
          </div>
        </div>
        <div className="coach-right row margin-top">
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-icon"
          />
          <div className="coach-image-container row justify-center align-center">
            <img
              src={getCoachPhoto(coach)}
              alt={getCoachName(coach)}
              className="coach-image"
            />
            <div className="play-background row justify-center align-center">
              <img
                src="/static/images/newCoach/polygon.png"
                alt="aura"
                className="polygone"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default OneOnOne;
