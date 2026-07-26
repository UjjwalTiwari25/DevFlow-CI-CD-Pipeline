import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Text from '../../../app/Text';
import styles from './styles';
import AuraRingClean from '../../../app/AuraRingClean';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import useAuthUser from '../../../../hooks/authUser';
import UserDropDown from '../../../app/UserDropDown';
import CleanLoginModal from '../../../login/CleanLoginModal';
import AuraLiveDetails from '../../../coachingLive/AuraLiveDetails';
import SpotReserved from '../../../coachingLive/SpotReserved';
import usePageQuery from '../../../../hooks/pageQuery';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import { setShowLoginForm } from '../../../../store/slices/newCoachProfiles';
import useTrackPageView from '../../../../hooks/trackPageView';
import { getCoachName } from '../../../../models/coach';

const screens = ['liveDetails', 'spot'];

export default function LiveCoaching({ coach, liveEvent, onSubmitSignup }) {
  const { user, authLoading } = useAuthUser();
  const dispatch = useDispatch();
  const [currentScreenIndex, setCurrentScreen] = useState(0);

  const [, isMobile] = useResponsiveWindow();
  const { isSpotReserved = null } = usePageQuery();
  const { showLoginForm } = useShallowEqualSelector(({ live }) => live);
  const { id: liveEventId, title } = liveEvent || {};
  function onBack() {
    if (currentScreenIndex === 0) {
      return;
    }
    setCurrentScreen(currentScreenIndex - 1);
    window.scrollTo(0, 0);
  }
  const loginModalRef = useRef(null);
  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }
  useEffect(() => {
    if (isSpotReserved) {
      setCurrentScreen(1);
    }
  }, [isSpotReserved]);
  useTrackPageView(
    {
      LiveEventId: liveEventId,
      LiveEventName: title,
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
      IsSpotReserved: isSpotReserved,
    },
    [liveEvent]
  );
  return (
    <div className="main">
      <img
        src="/static/images/newCoach/opticalBackground.png"
        alt="aura background"
        className="optical-background"
      />
      <div className="outer-wrap">
        {(!(currentScreenIndex > 0 && isMobile) || !isMobile) && (
          <div className="w-100 nav">
            <div className="aura">
              <div className="row align-center">
                <AuraRingClean size={34} />
                {!isMobile && (
                  <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                    Aura
                  </Text>
                )}
              </div>
            </div>
            {!user && currentScreenIndex === 0 && (
              <div
                className="clickable signin-button"
                onClick={() => {
                  if (loginModalRef.current) {
                    dispatch(setShowLoginForm(true));
                    loginModalRef.current.show();
                  }
                }}>
                <Text type="body" color="b100">
                  Sign in
                </Text>
              </div>
            )}
            {user && currentScreenIndex === 0 && (
              <div
                className="signin-button"
                style={{
                  position: 'relative',
                }}>
                <UserDropDown
                  user={user}
                  authLoading={authLoading}
                  style={{ maxWidth: '100%' }}
                  isCoachingSession
                />
              </div>
            )}
          </div>
        )}
        <LiveSessionScreens
          coach={coach}
          tab={screens[isSpotReserved ? 1 : currentScreenIndex]}
          onNext={() => {
            if (currentScreenIndex + 1 < screens.length) {
              setCurrentScreen(currentScreenIndex + 1);
            }
          }}
          onBack={() => {
            if (isSpotReserved) {
              return;
            }
            onBack();
          }}
          showLoginModal={showLoginModal}
          liveEvent={liveEvent}
          onSubmitSignup={onSubmitSignup}
          isSpotReserved={isSpotReserved}
        />
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        showLoginForm={showLoginForm}
        loading={authLoading}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
function LiveSessionScreens({ tab, ...props }) {
  switch (tab) {
    case 'liveDetails':
      return <AuraLiveDetails {...props} />;
    case 'spot':
      return <SpotReserved {...props} />;
    default:
      return null;
  }
}
