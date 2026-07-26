import React, { useState, useImperativeHandle, forwardRef } from 'react';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import classNames from 'classnames';
import styles from './styles';
import Signup from '../Signup';

function SaveProgressModal({ experiments, onNext, user }, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const [, isMobile] = useResponsiveWindow();

  function show() {
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
    window.scrollTo(0, 0);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (!isVisible) {
    return null;
  }

  return (
    <div className={'show-offer-modal'}>
      <div
        className={classNames('item-container', {
          'web-postion': !isMobile,
        })}>
        <Signup
          onNext={onNext}
          hide={hide}
          isModalSignup={true}
          experiments={experiments}
          user={user}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(SaveProgressModal);
