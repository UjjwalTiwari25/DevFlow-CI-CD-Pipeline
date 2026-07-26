import React, { useState, useImperativeHandle, forwardRef } from 'react';
import Analytics from '../../../../services/Analytics';
import AuraRingClean from '../../../app/AuraRingClean';
import Text from '../../../app/Text';
import styles from './styles';

function SkipModal({ handleNotNow, user }, ref) {
  const [isVisible, setIsVisible] = useState(false);
  function show() {
    setIsVisible(true);
  }
  function hide() {
    Analytics.track('Close New Coaching Flow Skip Modal', {
      UserId: user.id,
    });
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
    <div id="coach-modal">
      <div className="modal-container col align-center">
        <AuraRingClean size={80} style={{ marginTop: 40, marginBottom: 6 }} />
        <Text type="h3" weight="semibold" color="w100">
          Are you sure?
        </Text>
        <Text
          type="body"
          weight="regular"
          align="center"
          style={{
            color: '#5B657A',
            maxWidth: 276,
            marginTop: 13,
            lineHeight: '20px',
          }}>
          The free 1-1 coaching onboarding call is included with your
          subscription.
        </Text>
        <div className="row button-container">
          <div
            className="button clickable row align-center justify-center button-margin"
            onClick={() => {
              handleNotNow();
            }}>
            <Text
              type="cta"
              align="left"
              weight="bold"
              style={{
                background: 'linear-gradient(to right, #F40303, #F87801)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}>
              Skip
            </Text>
          </div>
          <div
            className="button clickable row align-center justify-center"
            onClick={() => {
              hide();
            }}>
            <Text type="cta" align="left" weight="bold" color="w100">
              Stay
            </Text>
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(SkipModal);
