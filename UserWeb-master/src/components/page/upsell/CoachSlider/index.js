import React, { useState } from 'react';
import useInterval from '../../../../hooks/interval';
import Text from '../../../app/Text';
import CustomeRecomendations from './CustomeRecomendations';
import DailyAccess from './DailyAccess';
import SharedJournal from './SharedJournal';
import styles from './styles';
import TrackYourSelf from './TrackYourSelf';

const title = [
  'Daily access to 1-on-1 personal coaching with your favorite coach',
  'Custom recommendations from your coach',
  'Save Insights with a private & shared Journal',
  'Track your Mindfulness, Sleep, and Mood with your coach',
];
const screens = [0, 1, 2, 3];
export default function CoachSlider() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useInterval(
    () => {
      setPercentage(percentage + 1);
      if (percentage === 100 && currentScreen < 3) {
        setCurrentScreen(currentScreen + 1);
        setPercentage(0);
      }
      if (percentage === 100 && currentScreen === 3) {
        setCurrentScreen(0);
        setPercentage(0);
      }
    },
    percentage > 100 ? null : 35
  );

  function nextScreen() {
    setPercentage(0);
    if (currentScreen < 3) {
      setCurrentScreen(currentScreen + 1);
    } else {
      setCurrentScreen(0);
    }
  }

  function previusScreen() {
    setPercentage(0);
    if (currentScreen === 0) {
      setCurrentScreen(3);
    } else {
      setCurrentScreen(currentScreen - 1);
    }
  }

  return (
    <div className="box col align-center">
      <div className="w-100 row bar-container">
        {screens.map((bar) => (
          <div className="relative bar" key={bar}>
            {bar === currentScreen && (
              <div className="bar-filled" style={{ width: `${percentage}%` }} />
            )}
            {bar < currentScreen && (
              <div className="bar-filled bar-filled-width" />
            )}
            <div className="bar"></div>
          </div>
        ))}
      </div>
      <Text
        type="h4-large"
        color="b100"
        align="center"
        weight="semibold"
        style={{ marginTop: 21, lineHeight: '24.36px', maxWidth: 262 }}>
        {title[currentScreen]}
      </Text>
      <div className="relative mobile-frame row justify-center">
        <div className="row overlay-conatiner">
          <div className="left-overlay" onClick={() => previusScreen()} />
          <div className="right-overlay" onClick={() => nextScreen()} />
        </div>
        {currentScreen < 2 && (
          <>
            <img
              src="/static/images/joinlist/mobileFrame.png"
              alt="aura"
              className="frame"
            />
            <img
              src="/static/images/joinlist/mobileFrameBackground.png"
              alt="aura"
              className="frame-background"
            />
          </>
        )}
        {currentScreen === 0 && <DailyAccess />}
        {currentScreen === 1 && <CustomeRecomendations />}
        {currentScreen === 2 && <SharedJournal />}
        {currentScreen === 3 && <TrackYourSelf />}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
