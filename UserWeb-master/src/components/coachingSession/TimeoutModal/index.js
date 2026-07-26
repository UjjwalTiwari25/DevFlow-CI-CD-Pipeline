import React, { useState, useImperativeHandle, forwardRef } from 'react';
import AuraButton from '../../app/AuraButton';
import Text from '../../app/Text';
import styles from './styles';

function TimeoutModal({ onBack }, ref) {
  const [isVisible, setIsVisible] = useState(false);
  function show() {
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (!isVisible) {
    return null;
  }
  return (
    <div id="login-modal">
      <div className="container col align-center justify-center">
        <img
          src="/static/images/coachingSession/modalClock.png"
          alt="aura"
          className="icon"
        />
        <Text
          type="cta"
          color="b100"
          align="center"
          style={{ marginTop: 10, marginBottom: 10 }}>
          Your time slot has expired
        </Text>
        <Text type="body2" color="b100" align="center">
          Please schedule again
        </Text>
        <AuraButton
          cleanStyle
          withShadow
          title="Continue"
          textWeight="bold"
          style={{
            height: 50,
            marginTop: 23,
            width: '100%',
            boxShadow: 'rgb(4 210 244 / 42%) 0px 11px 16px 1px',
          }}
          onClick={() => {
            onBack();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(TimeoutModal);
