import React, { useEffect, useRef, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import useCoachAvailability from '@/hooks/coachAvailability';
import useTranslations from '@/hooks/translations';
import schedulingConstants from '@/utils/constants/scheduling';
import VideoSessionLandingPage from '@/components/videoSession/LandingPage';
import useThemeListener from '@/hooks/themeListener';
import PlanPayment from '@/components/videoSession/LandingPage/PlanPayment';
import SelectCoachingPlanScreen from '@/components/videoSession/LandingPage/SelectCoachingPlanScreen';
import Text from '../../../app/Text';
import styles from './styles.module.scss';
import AuraRingClean from '../../../app/AuraRingClean';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import useAuthUser from '../../../../hooks/authUser';
import UserDropDown from '../../../app/UserDropDown';
import Payment from '../../../coachingSession/Payment';
import Congrats from '../../../coachingSession/Congrats';
import SelectDateTime from '../../../coachingSession/SelectDateTime';
import CleanLoginModal from '../../../login/CleanLoginModal';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import {
  createdCoachAppointment,
  setDate,
  setSelectedPlan,
  setLoadingMore,
} from '../../../../store/slices/coaching';
import { deleteAppointment } from '../../../../models/service';
import usePageQuery from '../../../../hooks/pageQuery';
import { setUTM } from '../../../../store/slices/payment';
import useTrackPageView from '../../../../hooks/trackPageView';
import { getCoachName } from '../../../../models/coach';
import Stripe from '../../../../services/Stripe';

const screens = ['details', 'payment', 'congrats'];

export default function VideoSession({
  coach,
  onSubmitSignup,
  coachSchedulngData,
}) {
  const { t } = useTranslations();
  const { isDark } = useThemeListener();
  const [limit, setLimit] = useState(7);
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [windowSize, isMobile] = useResponsiveWindow();
  const [isReachEnd, setIsReachEnd] = useState(false);
  const [videoCoachingPackages, setVideoCoachingPackages] = useState([]);

  const {
    sortedTimeSlots,
    appointment,
    waitListStatus,
    selectedDate,
    selectedPlan,
    selectedDuration,
  } = useShallowEqualSelector(({ coaching }) => coaching);

  const { allPackages, allServices, schedulingDetails } = coachSchedulngData;
  const dispatch = useDispatch();
  const {
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
    excludeDiscovery = null,
  } = usePageQuery();
  useCoachAvailability(limit, coach.id, {
    duration: selectedDuration,
    sessionTypeId: schedulingConstants.SESSION_TYPES.FREE_DISCOVERY,
  });

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

  useEffect(() => {
    if (sortedTimeSlots && !selectedDate) {
      const dateObj = Object.keys(sortedTimeSlots)[0];
      dispatch(setDate(dateObj));
    }
  }, [dispatch, sortedTimeSlots, selectedDate]);

  // filter video coaching packages
  useEffect(() => {
    if (allPackages && allPackages.length > 0) {
      setVideoCoachingPackages(
        allPackages.filter((packageItem) =>
          packageItem.features.some(
            (featureItem) => featureItem.feature === 'video'
          )
        )
      );
    }
  }, [allPackages]);

  useEffect(() => {
    if (isReachEnd && limit < 60) {
      setLimit(limit + 7);
      setIsReachEnd(false);
      dispatch(setLoadingMore(true));
    }
  }, [isReachEnd, setLimit, dispatch]);

  useEffect(() => {
    if (
      screens.includes('payment') &&
      !screens.includes('planPayment') &&
      excludeDiscovery
    ) {
      screens.splice(screens.indexOf('payment'), 1, 'planPayment');
    }
  }, [excludeDiscovery]);

  useEffect(() => {
    if (windowSize.width <= 1024 && !excludeDiscovery) {
      if (screens.includes('payment') && !screens.includes('selectDate')) {
        screens.splice(screens.indexOf('payment'), 0, 'selectDate');
      }
    }
    if (windowSize.width <= 1024 && excludeDiscovery) {
      if (screens.includes('planPayment') && !screens.includes('selectPlan')) {
        screens.splice(screens.indexOf('planPayment'), 0, 'selectPlan');
      }
    }
    if (windowSize.width > 1024) {
      if (screens.includes('selectDate')) {
        screens.splice(screens.indexOf('selectDate'), 1);
      }
      if (screens.includes('selectPlan')) {
        screens.splice(screens.indexOf('selectPlan'), 1);
      }
    }
  }, [windowSize]);

  useTrackPageView(
    {
      CoachId: coach?.id,
      CoachName: getCoachName(coach),
    },
    [coach]
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
      screens[currentScreenIndex] === 'planPayment' &&
      selectedPlan !== null
    ) {
      dispatch(setSelectedPlan(null));
    }
    if (
      (screens[currentScreenIndex] === 'payment' && !user) ||
      screens[currentScreenIndex] !== 'payment'
    ) {
      setCurrentScreen(currentScreenIndex - 1);
      window.scrollTo(0, 0);
    }
  }

  const onNext = () => {
    if (currentScreenIndex + 1 < screens.length) {
      setCurrentScreen(currentScreenIndex + 1);
    }
  };

  const loginModalRef = useRef(null);
  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
    }
  }

  return (
    <div
      className={classNames(
        'w-100 col align-center',
        styles.defaultBackground,
        {
          'light-theme': !isDark,
          'dark-theme': isDark,
        }
      )}>
      {(currentScreenIndex < 2 || isMobile) && (
        <img
          src="/static/images/newCoach/opticalBackground.png"
          alt="aura background"
          className={styles.opticalBackground}
        />
      )}

      {screens[currentScreenIndex] === 'congrats' && (
        <div className={styles.backgroundCongrats}>
          <img
            src="/static/images/coachingSession/congrats-background.png"
            alt="aura"
            className={styles.backgroundCongrats}
          />
          <img
            src="/static/images/coachingSession/congrats-background-circle.png"
            alt="aura"
            className={styles.backgroundCir}
          />
        </div>
      )}
      <div className={styles.main}>
        <div className={styles.outerWrap}>
          <div className={classNames('w-100 row align-items', styles.nav)}>
            <div className={styles.aura}>
              <div className="row align-center">
                <AuraRingClean size={34} style={{ marginLeft: '-4px' }} />
                <div className={styles.auraText}>
                  <Text type="cta" color="b100" style={{ marginLeft: 16 }}>
                    Aura
                  </Text>
                </div>
              </div>
              {((currentScreenIndex > 0 &&
                currentScreenIndex < 3 &&
                windowSize.width <= 1024) ||
                (currentScreenIndex > 0 &&
                  currentScreenIndex < 2 &&
                  !windowSize.width <= 1024)) && (
                <div
                  className={classNames(
                    'row row-container clickable',
                    styles.backButton
                  )}
                  onClick={() => {
                    onBack();
                  }}>
                  <img
                    src="/static/images/coachingSession/arrow.png"
                    alt="aura"
                    className={styles.arrow}
                  />
                  <Text type="cta" color="b100" style={{ marginLeft: 12 }}>
                    {t('button_back')}
                  </Text>
                </div>
              )}
            </div>

            {user &&
              ((currentScreenIndex < 2 && !isMobile) ||
                (currentScreenIndex < 3 && isMobile)) && (
                <div
                  className={styles.signinButton}
                  style={{
                    position: 'relative',
                    zIndex: 3,
                  }}>
                  <UserDropDown
                    user={user}
                    authLoading={authLoading}
                    style={{ maxWidth: '100%' }}
                    isCoachingSession
                    isDisabled={
                      screens[currentScreenIndex] === 'payment' ||
                      screens[currentScreenIndex] === 'planPayment'
                    }
                  />
                </div>
              )}
          </div>
          <Elements stripe={Stripe.instance}>
            <SessionScreens
              coach={coach}
              tab={screens[currentScreenIndex]}
              onNext={() => {
                onNext();
              }}
              onBack={() => {
                onBack();
              }}
              showLoginModal={showLoginModal}
              onSubmitSignup={onSubmitSignup}
              waitListStatus={waitListStatus}
              setIsReachEnd={setIsReachEnd}
              allServices={allServices}
              allPackages={videoCoachingPackages}
              schedulingDetails={schedulingDetails}
              videoCoachingFlow
              excludeDiscovery={excludeDiscovery}
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
    </div>
  );
}
function SessionScreens({ tab, ...props }) {
  switch (tab) {
    case 'details':
      return <VideoSessionLandingPage {...props} />;
    case 'selectDate':
      return <SelectDateTime {...props} />;
    case 'selectPlan':
      return <SelectCoachingPlanScreen {...props} />;
    case 'payment':
      return <Payment {...props} />;
    case 'planPayment':
      return <PlanPayment {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
