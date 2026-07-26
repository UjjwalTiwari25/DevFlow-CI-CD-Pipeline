import React from 'react';
import {
  getCoachFirstName,
  getCoachName,
  getCoachPhoto,
} from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

function Journal({ coach }) {
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
        <div className="lock-container">
          <div className="row align-center">
            <img
              src="/static/images/newCoach/lock.png"
              alt="icon"
              className="lock-icon"
            />
            <Text color="b100" type="footnote" weight="semibold">
              Private Journal note
            </Text>
          </div>
          <Text
            color="b64"
            type="footnote-small"
            weight="regular"
            style={{ marginTop: 12 }}>
            I’m noticing my stress & anxiety levels incr..
          </Text>
          <Text
            color="b100"
            type="footnote-small"
            weight="bold"
            style={{ marginTop: 12 }}>
            Only you can see it
          </Text>
        </div>
        <div className="lock-container margin-top">
          <Text color="b100" type="footnote" weight="semibold">
            Private Journal note
          </Text>
          <Text
            color="b64"
            type="footnote-small"
            weight="regular"
            style={{ marginTop: 12, marginBottom: 12 }}>
            I was feeling anxious today after a work proj..
          </Text>
          <div className="row align-center">
            <img src={getCoachPhoto(coach)} alt="icon" className="coach-icon" />
            <Text color="b100" type="footnote-small" weight="semibold">
              Shared with {getCoachFirstName(coach)}
            </Text>
          </div>
        </div>
        <div className="coach-right row margin-top">
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-icon-large"
          />
          <div className="chat-box-white">
            <Text color="b100" type="footnote-small">
              It’s completely normal to feel that way. What made you fe..
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default Journal;
