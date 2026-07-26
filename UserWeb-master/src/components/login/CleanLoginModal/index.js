import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import useAuthUser from '../../../hooks/authUser';
import CoachingLoginCard from '../CoachingLoginCard';
import styles from './styles';

function CleanLoginModal(
  {
    isCoachingSession,
    coach,
    onSubmit,
    showLoginForm,
    loading,
    community,
    handleCloseModal,
  },
  ref
) {
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
    if (handleCloseModal && typeof handleCloseModal === 'function')
      handleCloseModal();
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
    <div className="login-modal">
      <CoachingLoginCard
        onSubmit={onSubmit}
        header={'Log in to your account'}
        onClose={hide}
        style={{ position: 'relative' }}
        isCoachingSession={isCoachingSession}
        showGoogleLogin
        showLoginForm={showLoginForm}
        disableSocial
        coach={coach}
        loading={loading}
        community={community}
      />
      <style jsx>{styles}</style>
    </div>
  );
}

export default forwardRef(CleanLoginModal);
