import React from 'react';
import Text from '../../../../app/Text';
import styles from './styles';

export default function TrackYourSelf() {
  return (
    <div className="main">
      <div className="box row">
        <img
          src="/static/images/joinlist/circle-graph.png"
          alt="aura graph"
          className="graph"
        />
        <div className="text">
          <div className="row">
            <Text
              type="body"
              align="left"
              weight="bold"
              style={{
                background: 'linear-gradient(to right, #5CE6F4, #56E774)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                marginRight: 6,
              }}>
              Mindfulness
            </Text>
            <Text type="body" align="left" color="b64" weight="bold">
              20/30 min
            </Text>
          </div>
          <div className="row text-container">
            <Text
              type="body"
              align="left"
              weight="bold"
              style={{
                background:
                  'linear-gradient(to right, #8E83FC, #8F82FC, #5FC6FC, #67BBFC)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                marginRight: 6,
              }}>
              Sleep
            </Text>
            <Text type="body" align="left" color="b64" weight="bold">
              6/8 hr
            </Text>
          </div>
          <div className="row text-container">
            <Text
              type="body"
              align="left"
              weight="bold"
              style={{
                background: 'linear-gradient(to right, #D16FE8, #F494B3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                marginRight: 6,
              }}>
              Mood
            </Text>
            <Text type="body" align="left" color="b64" weight="bold">
              1/3 Mood
            </Text>
          </div>
        </div>
      </div>
      <img
        src="/static/images/joinlist/wellnessGraph.png"
        alt="aura graph"
        className="graph-wellness"
      />
      <img
        src="/static/images/joinlist/chat-cass.png"
        alt="aura graph"
        className="chat-cass"
      />
      <style jsx>{styles}</style>
    </div>
  );
}
