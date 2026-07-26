import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Router from 'next/router';
import Link from 'next/link';
import useAuthUser from '../../../hooks/authUser';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import {
  setLoginModalRef,
  setShowLoginForm,
  showLoginModal,
} from '../../../store/slices/newCoachProfiles';
import AuraRingClean from '../../app/AuraRingClean';
import Text from '../../app/Text';
import UserDropDown from '../../app/UserDropDown';
import styles from './styles';
import CleanLoginModal from '../../login/CleanLoginModal';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import AuraLiveUpComingBigCard from '../../upcoming/AuraLiveUpComingBigCard';
import AuraLiveUpComingList from '../../upcoming/AuraLiveUpComingList';
import {
  reserveSpot,
  setLiveEventAction,
  setLoading,
} from '../../../store/slices/live';
import { generateQueryPath } from '../../../utils';
import routeConstants from '../../../utils/constants/routes';
import Analytics from '../../../services/Analytics';
import { getCoachName } from '../../../models/coach';
import useTrackPageView from '../../../hooks/trackPageView';

export default function UpComingPage({
  liveEvents,
  onSubmitSignup,
  coachDetails,
  setCoachDetails,
}) {
  const [, isMobile] = useResponsiveWindow();
  const dispatch = useDispatch();
  const { user, authLoading } = useAuthUser();
  const loginModalRef = useRef(null);
  const { showLoginForm } = useShallowEqualSelector(({ profiles }) => profiles);
  const remainingLiveEvents = liveEvents && liveEvents.slice(1);
  const { liveEventDetails } = useShallowEqualSelector(({ live }) => live);
  useTrackPageView();

  const redirectHandler = useCallback(async (event, coach) => {
    if (!coach) return;
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHES}/${coach?.slug}/${routeConstants.PAGE_LIVE}`,
      {
        isSpotReserved: true,
        liveEventId: event.id,
      }
    );
    Router.push(path).then(() => {
      window.scrollTo(0, 0);
    });
  }, []);

  useEffect(() => {
    async function reserveLiveEventSpot() {
      const { id: liveEventId, title } = liveEventDetails;
      const res = await dispatch(
        reserveSpot({ liveEventId: liveEventDetails.id })
      );
      dispatch(setLoading(false));
      if (res && !res.error) {
        Analytics.track('Reserved Live Event', {
          LiveEventId: liveEventId,
          LiveEventName: title,
          CoachId: coachDetails?.id,
          CoachName: getCoachName(coachDetails),
          Source: 'live-list',
        });
        redirectHandler(liveEventDetails, coachDetails);
      }
    }
    if (
      user &&
      liveEventDetails &&
      liveEventDetails.reservations &&
      !liveEventDetails.reservations[user.id]
    ) {
      dispatch(setLoading(true));
      setTimeout(function () {
        reserveLiveEventSpot();
      }, 5000);
    }
  }, [dispatch, liveEventDetails, redirectHandler, user, coachDetails]);

  useEffect(() => {
    if (loginModalRef && loginModalRef.current) {
      dispatch(setLoginModalRef(loginModalRef.current));
    }
  }, [dispatch, showLoginForm]);

  const isAlreadyReserved = useCallback(
    (event) => {
      if (
        user &&
        event &&
        event.reservations &&
        !!event.reservations[user.id]
      ) {
        return true;
      }
      return false;
    },
    [user]
  );

  async function handleSubmit(liveEvent, coach) {
    dispatch(setShowLoginForm(false));
    if (isAlreadyReserved(liveEvent)) {
      return;
    }
    if (user) {
      dispatch(setLiveEventAction(liveEvent));
      const res = await dispatch(reserveSpot({ liveEventId: liveEvent.id }));
      if (res && !res.error) {
        redirectHandler(liveEvent, coach);
      }
    } else {
      setCoachDetails(coach);
      dispatch(setLiveEventAction(liveEvent));
      dispatch(showLoginModal());
      if (loginModalRef.current) {
        loginModalRef.current.show();
      }
    }
  }

  return (
    <div className="container">
      <img
        src="/static/images/newCoach/opticalBackground.png"
        alt="aura background"
        className="optical-background"
      />
      <div className="outer-wrap col align-center">
        <div className="nav">
          <Link href={`/${routeConstants.PAGE_AURA}`} legacyBehavior>
            <a className="row align-center clickable aura-logo">
              <AuraRingClean size={34} />
              {!isMobile && (
                <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                  Aura
                </Text>
              )}
            </a>
          </Link>
          {!user && (
            <div
              className="clickable signin-button"
              onClick={() => {
                dispatch(setShowLoginForm(true));
                if (loginModalRef.current) {
                  loginModalRef.current.show();
                }
              }}>
              <Text type="body" color="b100">
                Sign in
              </Text>
            </div>
          )}
          {user && (
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
      </div>
      <div className="col align-center">
        <Text type={isMobile ? 'h4' : 'h1-large'} weight="regular" color="b100">
          {'Upcoming Aura Live'}
        </Text>
        <AuraLiveUpComingBigCard
          liveEvent={liveEvents[0]}
          isAlreadyReserved={isAlreadyReserved}
          handleSubmit={handleSubmit}
        />
        <div className="list-container">
          {remainingLiveEvents &&
            remainingLiveEvents.map((liveEvent) => (
              <AuraLiveUpComingList
                key={liveEvent.id}
                liveEvent={liveEvent}
                isAlreadyReserved={isAlreadyReserved}
                handleSubmit={handleSubmit}
              />
            ))}
        </div>
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        coach={coachDetails}
        onSubmit={onSubmitSignup}
        showLoginForm={showLoginForm}
        loading={authLoading}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
