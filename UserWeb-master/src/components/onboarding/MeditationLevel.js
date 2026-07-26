import React, { Fragment } from 'react';
import useBrowserHistory from '../../hooks/browserHistory';
import Text from '../app/Text';
import Header from './Header';

const MEDITATION_LEVEL_HEADERS = [
  {
    imageUrl: '/static/images/meditationLevels/never-tried.png',
    text: 'Never tried it',
    key: 'never_tried_it',
  },
  {
    imageUrl: '/static/images/meditationLevels/tried_few_times.png',
    text: `Tried it a few times`,
    key: 'tried_few_times',
  },
  {
    imageUrl: '/static/images/meditationLevels/love_it.png',
    text: `Love it!`,
    key: 'love_it',
  },
];

export default function MeditationLevel({ onNext, onBack }) {
  useBrowserHistory('meditationLevel', true, onBack, onNext);

  function onContinue(currentMeditationLevel) {
    onNext({ onboardingMeditationLevel: currentMeditationLevel });
  }

  return (
    <Fragment>
      <div>
        <div style={{ textAlign: 'center' }}>
          <Header title={`Great to meet you!`} />
        </div>
        <Text
          type="subtitle"
          weight="regular"
          color="b64"
          align="center"
          style={{
            width: '100%',
            marginTop: 20,
          }}>
          This will only take a minute. When it comes to meditation, you:
        </Text>
        <div className="item-container">
          {MEDITATION_LEVEL_HEADERS.map((item) => (
            <div className="mood-item clickable" key={item.text}>
              <img
                className="mood-image"
                src={item.imageUrl}
                alt={item.text}
                onClick={() => onContinue(item.key)}
              />
              <Text type="body" weight="regular" color="b100" align="center">
                {item.text}
              </Text>
            </div>
          ))}
        </div>
        <style jsx>{`
          .item-container {
            display: inline-flex;
            width: 100%;
            justify-content: center;
            margin-top: 40px;
            margin-bottom: 72px;
          }
          .mood-item {
            display: block;
            text-align: center;
            margin-right: 34px;
          }
          .mood-item:nth-child(3) {
            margin-right: 0px;
          }
          .mood-image {
            width: 80px;
            height: 80px;
            object-fit: contain;
          }
          @media screen and (max-width: 767px) {
            .item-container {
              display: flex;
              flex-wrap: wrap;
            }
            .mood-item {
              width: 50%;
              margin-right: 0px;
              margin-top: 20px;
            }
            .mood-image {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </Fragment>
  );
}
