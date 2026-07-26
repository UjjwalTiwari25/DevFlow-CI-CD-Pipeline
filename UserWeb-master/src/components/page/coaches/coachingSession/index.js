import React, { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { useDispatch } from 'react-redux';
import Text from '../../../app/Text';
import styles from './styles';
import AuraRingClean from '../../../app/AuraRingClean';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import useAuthUser from '../../../../hooks/authUser';
import UserDropDown from '../../../app/UserDropDown';
import Details from '../../../coachingSession/Details';
import Payment from '../../../coachingSession/Payment';
import Congrats from '../../../coachingSession/Congrats';
import SelectPlan from '../../../coachingSession/SelectPlan';
import SelectDateTime from '../../../coachingSession/SelectDateTime';
import CleanLoginModal from '../../../login/CleanLoginModal';
import Stripe from '../../../../services/Stripe';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import {
  createdCoachAppointment,
  setDate,
  setLoadingMore,
} from '../../../../store/slices/coaching';
import { deleteAppointment } from '../../../../models/service';
import usePageQuery from '../../../../hooks/pageQuery';
import { setUTM } from '../../../../store/slices/payment';
import useTrackPageView from '../../../../hooks/trackPageView';
import { getCoachName } from '../../../../models/coach';

const screens = ['details', 'payment', 'congrats'];

export default function CoachingSession({
  coach,
  onSubmitSignup,
  setLimit,
  limit,
}) {
  const {
    coachService,
    sortedTimeSlots,
    appointment,
    waitListStatus,
    selectedDate,
  } = useShallowEqualSelector(({ coaching }) => coaching);
  const dispatch = useDispatch();
  const { id: serviceId, title } = coachService || {};
  const {
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
  } = usePageQuery();

  useEffect(() => {
    dispatch(
      setUTM({
        attribution: utm_source,
        campaign: utm_campaign,
        medium: utm_medium,
        content: utm_content,
      })
    );
  }, [utm_source, utm_campaign, utm_medium, utm_content, dispatch]);

  const { user, authLoading } = useAuthUser();
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [, isMobile] = useResponsiveWindow();
  const [isReachEnd, setIsReachEnd] = useState(false);

  useEffect(() => {
    if (sortedTimeSlots && !selectedDate) {
      const dateObj = Object.keys(sortedTimeSlots)[0];
      dispatch(setDate(dateObj));
    }
  }, [dispatch, sortedTimeSlots, selectedDate]);

  useEffect(() => {
    if (isReachEnd && limit < 60) {
      setLimit(limit + 7);
      setIsReachEnd(false);
      dispatch(setLoadingMore(true));
    }
  }, [isReachEnd, setLimit, dispatch]);

  useEffect(() => {
    if (isMobile) {
      if (screens.includes('payment') && !screens.includes('selectPlan')) {
        screens.splice(screens.indexOf('payment'), 0, 'selectPlan');
      }
      if (screens.includes('payment') && !screens.includes('selectDate')) {
        screens.splice(screens.indexOf('payment'), 0, 'selectDate');
      }
    }
    if (!isMobile) {
      if (screens.includes('selectPlan')) {
        screens.splice(screens.indexOf('selectPlan'), 1);
      }
      if (screens.includes('selectDate')) {
        screens.splice(screens.indexOf('selectDate'), 1);
      }
    }
  }, [isMobile]);

  useTrackPageView(
    {
      ServiceId: serviceId,
      ServiceName: title,
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
    },
    [coachService, coach]
  );

  async function onBack() {
    if (currentScreenIndex === 0) {
      return;
    }
    if (
      screens[currentScreenIndex] === 'payment' &&
      appointment !== null &&
      user
    ) {
      const { id: appointmentId } = appointment;
      const { email, givenName: name } = user;
      const data = { appointmentId, name, email };
      const res = await deleteAppointment(data);
      if (res && !res.error) {
        setCurrentScreen(currentScreenIndex - 1);
        dispatch(createdCoachAppointment(null));
        window.scrollTo(0, 0);
      }
    }
    if (
      (screens[currentScreenIndex] === 'payment' && !user) ||
      screens[currentScreenIndex] !== 'payment'
    ) {
      setCurrentScreen(currentScreenIndex - 1);
      window.scrollTo(0, 0);
    }
  }

  const loginModalRef = useRef(null);
  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }
  return (
    <div className="w-100 col align-center default-background">
      {(currentScreenIndex < 2 || isMobile) && (
        <img
          src="/static/images/newCoach/opticalBackground.png"
          alt="aura background"
          className="optical-background"
        />
      )}
      {screens[currentScreenIndex] === 'congrats' && (
        <div className="background-congrats">
          <img
            src="/static/images/coachingSession/congrats-background.png"
            alt="aura"
            className="background-congrats"
          />
          <img
            src="/static/images/coachingSession/congrats-background-circle.png"
            alt="aura"
            className="background-cir"
          />
        </div>
      )}
      <div className="main">
        <div className="outer-wrap">
          <div className="w-100 row align-items nav">
            <div className="aura">
              <div className="row align-center">
                <AuraRingClean size={34} />
                <div className="aura-text">
                  <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                    Aura
                  </Text>
                </div>
              </div>
              {((currentScreenIndex > 0 &&
                currentScreenIndex < 4 &&
                isMobile) ||
                (currentScreenIndex > 0 &&
                  currentScreenIndex < 2 &&
                  !isMobile)) && (
                <div
                  className="row row-container clickable"
                  onClick={() => {
                    onBack();
                  }}>
                  <img
                    src="/static/images/coachingSession/arrow.png"
                    alt="aura"
                    className="arrow"
                  />
                  <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                    Back
                  </Text>
                </div>
              )}
            </div>
            {!user && (
              <div
                className="clickable signin-button"
                onClick={() => {
                  if (loginModalRef.current) {
                    loginModalRef.current.show();
                  }
                }}>
                <Text type="body" color="b100">
                  Sign in
                </Text>
              </div>
            )}

            {user &&
              ((currentScreenIndex < 2 && !isMobile) ||
                (currentScreenIndex < 4 && isMobile)) && (
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
                    isDisabled={screens[currentScreenIndex] === 'payment'}
                  />
                </div>
              )}
          </div>
          <Elements stripe={Stripe.instance}>
            <SessionScreens
              coach={coach}
              tab={screens[currentScreenIndex]}
              onNext={() => {
                if (currentScreenIndex + 1 < screens.length) {
                  setCurrentScreen(currentScreenIndex + 1);
                }
              }}
              onBack={() => {
                onBack();
              }}
              showLoginModal={showLoginModal}
              onSubmitSignup={onSubmitSignup}
              waitListStatus={waitListStatus}
              setIsReachEnd={setIsReachEnd}
            />
          </Elements>
        </div>
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        isCoachingSession
        coach={coach}
        onSubmit={onSubmitSignup}
        showLoginForm
        loading={authLoading}
      />
      <style jsx>{styles}</style>
    </div>
  );
}
function SessionScreens({ tab, ...props }) {
  switch (tab) {
    case 'details':
      return <Details {...props} />;
    case 'selectPlan':
      return <SelectPlan {...props} />;
    case 'selectDate':
      return <SelectDateTime {...props} />;
    case 'payment':
      return <Payment {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
