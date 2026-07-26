import React from 'react';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import styles from './styles';

function TrackYourSelf({ coach }) {
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
        <div className="graph-box row align-center">
          <img
            src="/static/images/newCoach/welnessGraph.webp"
            alt="wellness graph"
            className="graph-cir"
          />
          <div>
            <div className="row margin-10">
              <Text
                type="footnote-small"
                align="left"
                weight="semibold"
                style={{
                  background: 'linear-gradient(to right, #5CE6F4, #56E774)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  marginRight: 10,
                }}>
                Mindfulness
              </Text>
              <Text type="footnote-small" align="left" color="g100">
                3/5 min
              </Text>
            </div>
            <div className="row margin-10">
              <Text
                type="footnote-small"
                align="left"
                weight="semibold"
                style={{
                  background:
                    'linear-gradient(to right, #8E83FC, #8F82FC, #5FC6FC, #67BBFC)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  marginRight: 10,
                }}>
                Sleep
              </Text>
              <Text type="footnote-small" align="left" color="g100">
                6/8 hr
              </Text>
            </div>
            <div className="row margin-10">
              <Text
                type="footnote-small"
                align="left"
                weight="semibold"
                style={{
                  background: 'linear-gradient(to right, #D16FE8, #F494B3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                  marginRight: 10,
                }}>
                Mood
              </Text>
              <Text type="footnote-small" align="left" color="g100">
                1/3 Mood
              </Text>
            </div>
          </div>
        </div>
        <img
          src="/static/images/newCoach/welnessGraphVert.webp"
          alt="grpah"
          className="graph margin-top"
        />
        <div className="coach-right row margin-top">
          <img
            src={getCoachPhoto(coach)}
            alt={getCoachName(coach)}
            className="coach-icon"
          />
          <div className="chat-box-white">
            <Text color="b100" type="footnote-small">
              Wow! You started the week st..
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default TrackYourSelf;
