import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import LoginCard from '..';
import useAuthUser from '../../../hooks/authUser';
import styles from './styles';

function LoginModal({ allowSignup, useWhiteTheme, onSubmit }, ref) {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthUser();
  useEffect(() => {
    if (user) {
      hide();
    }
  }, [user]);
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
      <LoginCard
        header={'Log in to your account'}
        onClose={hide}
        disableSignup={!allowSignup}
        style={{ position: 'relative' }}
        useWhiteTheme={useWhiteTheme}
        onSubmit={onSubmit}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(LoginModal);
