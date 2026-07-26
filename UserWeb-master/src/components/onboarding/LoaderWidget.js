import React, { useState } from 'react';
import Text from '../app/Text';
import useInterval from '../../hooks/interval';
import useTimeout from '../../hooks/timeout';

const LOADING_ITEMS = [
  'your goals...',
  'your interests...',
  'your age...',
  'your gender...',
];

export default function LoaderWidget({ onNext }) {
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  useInterval(
    () => {
      setLoadingPercentage(loadingPercentage + 1);
    },
    loadingPercentage === 100 ? null : 100
  );
  useTimeout(onNext, 12500);
  return (
    <div className="loader-widget-container">
      <div id="ring-loader">
        <Text type="h4" align="center" color="b100" weight="regular">
          {`${loadingPercentage}%`}
        </Text>
      </div>
      {loadingPercentage >= 100 ? (
        <Text type="h4" align="center" color="b100" weight="regular">
          Your personalized plan is ready.
        </Text>
      ) : (
        <Text
          type="h4"
          component="h1"
          align="center"
          color="b100"
          weight="regular">
          Personalizing your plan based on{' '}
          <div id="plan-item-text">
            <Text color="cta-blue">
              {LOADING_ITEMS[Math.floor(loadingPercentage / 25)]}
            </Text>
          </div>
        </Text>
      )}
      <style jsx>{`
        .loader-widget-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        #ring-loader {
          width: 240px;
          height: 240px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: url('/static/images/icons/bigAuraRing.png') center/contain;
        }
        #plan-item-text {
          -webkit-animation-name: fadeInOut;
          animation-name: fadeInOut;
          animation-duration: 2.5s;
          animation-iteration-count: 4;
        }
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
