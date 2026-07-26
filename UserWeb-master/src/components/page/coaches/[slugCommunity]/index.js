import React, { useState, useEffect, useRef } from 'react';
import useThemeListener from '@/hooks/themeListener';
import { useDispatch } from 'react-redux';
import usePageQuery from '@/hooks/pageQuery';
import { setUTM } from '@/store/slices/payment';
import useAuthUser from '@/hooks/authUser';
import useTrackPageView from '@/hooks/trackPageView';
import { getCoachName } from '@/models/coach';
import classNames from 'classnames';
import { Elements } from '@stripe/react-stripe-js';
import Stripe from '@/services/Stripe';
import CleanLoginModal from '@/components/login/CleanLoginModal';
import { isUserCommunitySubscriber } from '@/models/user';
import Congrats from '@/components/community/Congrats';
import CommunityLandingPage from '@/components/community/LandingPage';
import CommunityPaymentModal from '@/components/community/CommunityPaymentModal';
import styles from './styles.module.scss';

const screens = ['details', 'congrats'];

export default function Community({
  coach,
  community,
  communityCourses,
  communityEvents,
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
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoginModalShowed, setIsLoginModalShowed] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

  function showLoginModal() {
    if (loginModalRef.current) {
      loginModalRef.current.show();
      setLoginModalVisible(true);
      setIsLoginModalShowed(true);
    }
  }

  function closeLoginModal() {
    setLoginModalVisible(false);
  }

  function showPaymentModal() {
    if (paymentModalRef.current) {
      paymentModalRef.current.toggle();
      setPaymentModalVisible(true);
    }
  }

  function closePaymentModal() {
    if (paymentModalRef.current) {
      paymentModalRef.current.toggle();
      setPaymentModalVisible(false);
    }
  }

  async function onJoinCommunity() {
    if (!user) {
      showLoginModal();
    } else {
      setJoinCommunity(true);
      showPaymentModal();
    }
  }

  const onNext = () => {
    if (currentScreenIndex + 1 < screens.length) {
      setCurrentScreen(currentScreenIndex + 1);
    }
  };

  const isUserSubscriber = isUserCommunitySubscriber(user, community.id);

  useTrackPageView(
    {
      'Community Owner ID': coach?.id,
      'Community Owner Name': getCoachName(coach),
      'Community ID': community?.id,
      'Community Name': community?.name,
    },
    [coach, community]
  );

  useEffect(() => {
    if (isLoginModalShowed && user && !isUserSubscriber) {
      onJoinCommunity();
    }
  }, [isLoginModalShowed, isUserSubscriber, user]);

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
      <Elements stripe={Stripe.instance}>
        <SessionScreens
          community={community}
          tab={screens[currentScreenIndex]}
          onJoinCommunity={onJoinCommunity}
          user={user}
          coach={coach}
          isUserSubscriber={isUserSubscriber}
          isLoginModalVisible={isLoginModalVisible}
          isPaymentModalVisible={isPaymentModalVisible}
          communityCourses={communityCourses}
          communityEvents={communityEvents}
        />

        <CommunityPaymentModal
          ref={paymentModalRef}
          community={community}
          coach={coach}
          joinCommunity={joinCommunity}
          isUserSubscriber={isUserSubscriber}
          onClose={closePaymentModal}
          onNext={onNext}
        />
      </Elements>

      <div className={styles.cleanLoginModal}>
        <CleanLoginModal
          ref={loginModalRef}
          coach={coach}
          onSubmit={onSubmitSignup}
          loading={authLoading}
          handleCloseModal={closeLoginModal}
          community={community}
        />
      </div>
    </div>
  );
}

function SessionScreens({ tab, ...props }) {
  switch (tab) {
    case 'details':
      return <CommunityLandingPage {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
