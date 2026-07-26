import React, { useState, useEffect, useRef, useMemo } from 'react';
import useThemeListener from '@/hooks/themeListener';
import { useDispatch } from 'react-redux';
import usePageQuery from '@/hooks/pageQuery';
import { setUTM } from '@/store/slices/payment';
import useAuthUser from '@/hooks/authUser';
import useTrackPageView from '@/hooks/trackPageView';
import Analytics from '@/services/Analytics';
import { getCoachName } from '@/models/coach';
import classNames from 'classnames';
import { Elements } from '@stripe/react-stripe-js';
import Stripe from '@/services/Stripe';
import CleanLoginModal from '@/components/login/CleanLoginModal';
import {
  isUserAlreadyPurchasedCourse,
  isUserCommunitySubscriber,
} from '@/models/user';
import { isCourseFree } from '@/models/course';
import CoursePaymentModal from '@/components/course/CoursePaymentModal';
import CourseLandingPage from '@/components/course/LandingPage';
import Congrats from '@/components/course/Congrats';
import UserDropDown from '@/components/app/UserDropDown';
import styles from './styles.module.scss';

const screens = ['details', 'congrats'];

export default function Course({
  coach,
  community,
  course,
  courseCoach,
  onSubmitSignup,
}) {
  const { isDark } = useThemeListener();
  const dispatch = useDispatch();
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
  const loginModalRef = useRef(null);
  const paymentModalRef = useRef(null);
  const [joinCommunity, setJoinCommunity] = useState(false);
  const [joinCourse, setJoinCourse] = useState(false);
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [isSignupButtonClick, setIsSignupButtonClick] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

  let isUserSubscriber = false;
  let isCoursePartOfCommunity = false;
  const isUserPurchasedCourse = isUserAlreadyPurchasedCourse(user, course?.id);

  if (community) {
    isUserSubscriber = isUserCommunitySubscriber(user, community.id);
    isCoursePartOfCommunity = true;
  }

  const commonAnalyticsParams = useMemo(() => {
    return {
      Screen: 'Course Details',
      'Page Type': 'Course and Community',
      'Course Name': course?.name,
      'Course ID': course?.id,
      'Community Name': community?.name,
      'Community ID': community?.id,
      'Coach Name': coach?.name,
      'Coach ID': coach?.id,
      'Community Revenue': community?.price,
    };
  }, [community, course, coach]);

  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
      setIsSignupButtonClick(true);
      setLoginModalVisible(true);
    }
  }

  function closeLoginModal() {
    setLoginModalVisible(false);
  }

  function showPaymentModal() {
    if (paymentModalRef.current) {
      paymentModalRef.current.show();
      setPaymentModalVisible(true);
    }
  }

  function closePaymentModal() {
    if (paymentModalRef.current) {
      paymentModalRef.current.hide();
      setPaymentModalVisible(false);
    }
  }

  async function onJoinCommunity() {
    if (!user) {
      showLoginModal();
    } else {
      setJoinCommunity(true);
      setJoinCourse(false);
      showPaymentModal();
    }
    if (!isSignupButtonClick) {
      Analytics.track('Purchase Button Tapped', {
        Button: 'Join Community',
        ...(commonAnalyticsParams || {}),
      });
    }
  }

  async function onJoinCourse() {
    if (!user) {
      showLoginModal();
    } else {
      setJoinCourse(true);
      setJoinCommunity(false);
      showPaymentModal();
    }
    if (!isSignupButtonClick) {
      Analytics.track('Purchase Button Tapped', {
        Button: 'Purchase Course',
        ...(commonAnalyticsParams || {}),
      });
    }
  }

  const onNext = () => {
    if (currentScreenIndex + 1 < screens.length) {
      setCurrentScreen(currentScreenIndex + 1);
    }
  };

  useTrackPageView(
    {
      'Coach ID': coach?.id,
      'Coach Name': getCoachName(coach),
      'Community ID': community?.id,
      'Community Name': community?.name,
      'Course ID': course?.id,
      'Course Name': course?.name,
    },
    [coach, course]
  );

  const handleButtonClick = async () => {
    if (!isCoursePartOfCommunity || isUserSubscriber) {
      onJoinCourse();
    } else {
      onJoinCommunity();
    }
  };

  useEffect(() => {
    if (
      user &&
      isSignupButtonClick &&
      (!isUserSubscriber || !isUserPurchasedCourse)
    ) {
      handleButtonClick();
    }
  }, [isSignupButtonClick, isUserPurchasedCourse, isUserSubscriber, user]);

  const isFreeCourse = useMemo(
    () => isCourseFree(isCoursePartOfCommunity, isUserSubscriber, course),
    [course, isCoursePartOfCommunity, isUserSubscriber]
  );

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
      <div className={styles.main}>
        <div className={styles.outerWrap}>
          <div className={classNames('w-100 row align-items', styles.nav)}>
            <img
              src="/static/images/logoHorizontal-black.png"
              alt="aura-logo"
              className={styles.auraLogoWithText}
            />
            {screens[currentScreenIndex] !== 'congrats' && user && (
              <UserDropDown user={user} authLoading={authLoading} />
            )}
          </div>
          <Elements stripe={Stripe.instance}>
            <SessionScreens
              coach={coach}
              community={community}
              course={course}
              tab={screens[currentScreenIndex]}
              courseCoach={courseCoach}
              onJoinCommunity={onJoinCommunity}
              onJoinCourse={onJoinCourse}
              user={user}
              isUserPurchasedCourse={isUserPurchasedCourse}
              isUserSubscriber={isUserSubscriber}
              isCoursePartOfCommunity={isCoursePartOfCommunity}
              isLoginModalVisible={isLoginModalVisible}
              isPaymentModalVisible={isPaymentModalVisible}
              onNext={onNext}
              isFreeCourse={isFreeCourse}
            />

            <CoursePaymentModal
              coach={coach}
              ref={paymentModalRef}
              course={course}
              community={community}
              courseCoach={courseCoach}
              joinCommunity={joinCommunity}
              joinCourse={joinCourse}
              isUserPurchasedCourse={isUserPurchasedCourse}
              isUserSubscriber={isUserSubscriber}
              isCoursePartOfCommunity={isCoursePartOfCommunity}
              onClose={closePaymentModal}
              onNext={onNext}
            />
          </Elements>
        </div>
      </div>
      <CleanLoginModal
        ref={loginModalRef}
        coach={coach}
        onSubmit={onSubmitSignup}
        loading={authLoading}
        handleCloseModal={closeLoginModal}
      />
    </div>
  );
}

function SessionScreens({ tab, ...props }) {
  switch (tab) {
    case 'details':
      return <CourseLandingPage {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
