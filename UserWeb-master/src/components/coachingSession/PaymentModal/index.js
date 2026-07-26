import React, { useImperativeHandle, forwardRef, useState } from 'react';
import AuraButton from '../../app/AuraButton';
import AuraRingClean from '../../app/AuraRingClean';
import Text from '../../app/Text';
import CoachingCardInput from '../../payment/clean/CoachingCardInput';
import styles from './styles';

function PaymentModal(props, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const { onClick, isProcessing } = props;

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
      <div className="modal-container-light">
        <img
          src="/static/images/coachingSession/modalBackground.png"
          alt="background"
          className="modalbackground"
        />
        <div className="modal-content">
          <div
            className="close-icon clickable"
            onClick={() => {
              hide();
            }}>
            <img
              src="/static/images/coachingSession/close.png"
              className="close"
              alt="close icon"
            />
          </div>
          <div className="col align-center container w-100 payment-container">
            <AuraRingClean size={73} />
            <Text type="body2" color="b100" style={{ marginTop: 4 }}>
              Complete your payment
            </Text>
            <div className="input-container">
              <img
                src="/static/images/coachingSession/cc-background.png"
                alt="aura green check"
                className="cc-background"
              />
              <CoachingCardInput disabled={isProcessing} />
            </div>
            {isProcessing ? (
              <AuraRingClean size={60} />
            ) : (
              <AuraButton
                cleanStyle
                withShadow
                title="Confirm"
                textWeight="bold"
                style={{
                  marginTop: 16,
                  height: 55,
                  width: '100%',
                  position: 'relative',
                }}
                onClick={onClick}
              />
            )}
            <img
              src="/static/images/coachingSession/secure.png"
              alt="aura green check"
              className="secure-check"
            />
          </div>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(PaymentModal);
