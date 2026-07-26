import React from 'react';
import { getCoachFirstName, getCoachPhoto } from '../../../../../models/coach';
import Text from '../../../../app/Text';
import styles from './styles';

export default function SharedJournal({ coach }) {
  return (
    <div className="container">
      <img
        src="/static/images/vpcoaching/background.png"
        alt="coach"
        className="background-image"
      />
      <img
        src="/static/images/vpcoaching/background-round.png"
        alt="coach"
        className="background-image"
      />
      <div className="item-container">
        <div className="chat-container">
          <div className="large-box">
            <div className="row">
              <img
                src="/static/images/vpcoaching/lock.png"
                alt="aura"
                className="lock-icon"
              />
              <Text type="body" weight="semibold" color="b100">
                Private Journal note
              </Text>
            </div>
            <Text type="body2" color="g50" style={{ marginTop: 11 }}>
              I’m noticing my stress & anxiety levels incr..
            </Text>
            <Text
              type="body2"
              color="b100"
              weight="semibold"
              style={{ marginTop: 11 }}>
              Only you can see it
            </Text>
          </div>
          <div className="large-box">
            <Text type="body" color="b100" weight="semibold">
              Journal note
            </Text>
            <Text type="body2" color="g50" style={{ marginTop: 11 }}>
              I was feeling anxious today after a work proj..
            </Text>
            <div className="row align-center" style={{ marginTop: 11 }}>
              <div
                className="chat-coach-pic-small"
                style={{
                  backgroundImage: `url(${getCoachPhoto(coach)})`,
                }}></div>
              <Text type="body2" weight="semibold" color="b100">
                Shared with {getCoachFirstName(coach)}
              </Text>
            </div>
          </div>
          <div className="chat-row-left">
            <div
              className="chat-coach-pic"
              style={{ backgroundImage: `url(${getCoachPhoto(coach)})` }}></div>
            <div className="chat-box">
              <Text
                type="body2"
                align="left"
                color="b100"
                style={{ width: '88%' }}>
                It’s completely normal to feel that way. What made you fe..
              </Text>
            </div>
          </div>
        </div>
        <div className="text-container">
          <Text
            type="h4-large"
            color="b100"
            align="center"
            weight="normal"
            style={{ marginTop: 40, maxWidth: 318 }}>
            Private & Shared Journal
          </Text>
          <Text
            type="body"
            color="b100"
            align="center"
            style={{ marginTop: 12, width: '95%', lineHeight: '21px' }}>
            Keep track of all your insights, learnings, and thoughts throughout
            coaching. Share notes with {getCoachFirstName(coach)} anytime to
            enhance your coaching experience
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
