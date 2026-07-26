import React, { useState, useEffect, useRef, useMemo } from 'react';
import useThemeListener from '@/hooks/themeListener';
import { useDispatch } from 'react-redux';
import usePageQuery from '@/hooks/pageQuery';
import { setUTM } from '@/store/slices/payment';
import useAuthUser from '@/hooks/authUser';
import { useRouter } from 'next/router';
import useTrackPageView from '@/hooks/trackPageView';
import { getCoachName } from '@/models/coach';
import Analytics from '@/services/Analytics';
import { isEventFromPast, isEventFree, bookEvent } from '@/models/event';
import classNames from 'classnames';
import { Elements } from '@stripe/react-stripe-js';
import Stripe from '@/services/Stripe';
import CleanLoginModal from '@/components/login/CleanLoginModal';
import {
  isUserAlreadyPurchasedEvent,
  isUserCommunitySubscriber,
} from '@/models/user';
import Congrats from '@/components/event/Congrats';
import EventLandingPage from '@/components/event/LandingPage';
import EventPaymentModal from '@/components/event/EventPaymentModal';
import useToastMessage from '@/hooks/toastMessage';
import UserDropDown from '@/components/app/UserDropDown';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

const screens = ['details', 'congrats'];

export default function Event({
  coach,
  community,
  event,
  eventCoach,
  onSubmitSignup,
}) {
  const { t } = useTranslations();
  const router = useRouter();
  const { showError } = useToastMessage();
  const [isSignupButtonClick, setIsSignupButtonClick] = useState(false);

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
  const [joinEvent, setJoinEvent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);

  let isUserSubscriber = false;
  let isEventPartOfCommunity = false;
  const isUserPurchasedEvent = isUserAlreadyPurchasedEvent(user, event?.id);
  const isPastEvent = isEventFromPast(event);
  const isExclusiveToCommunity = event.exclusiveToCommunity;
  if (community) {
    isUserSubscriber = isUserCommunitySubscriber(user, community.id);
    isEventPartOfCommunity = true;
  }

  const isFreeEvent = useMemo(
    () =>
      isEventFree({
        isEventPartOfCommunity,
        isExclusiveToCommunity,
        isUserSubscriber,
        event,
      }),
    [event, isEventPartOfCommunity, isUserSubscriber, isExclusiveToCommunity]
  );

  const commonAnalyticsParams = useMemo(() => {
    return {
      'Sent From': 'Event Landing Page',
      'Page Name': 'Event',
      'Page Path': router.asPath,
      'Page Type': 'Event and Community',
      'Community Name': community?.name,
      'Community ID': community?.id,
      'Community Owner ID': community?.ownerId,
      'Coach Name': eventCoach?.name,
      'Coach ID': eventCoach?.id,
      'Event Revenue':
        isEventPartOfCommunity && isUserSubscriber
          ? event?.communityPrice
          : event?.price,
      'Event Name': event?.name,
      'Event ID': event?.id,
      'Meeting Method': 'Zoom',
      'Event Purchase Status': isUserPurchasedEvent
        ? 'Purchased'
        : 'Not Purchased',
    };
  }, [
    router.asPath,
    community,
    eventCoach,
    isEventPartOfCommunity,
    isUserSubscriber,
    event,
    isUserPurchasedEvent,
  ]);

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

  const onNext = () => {
    if (currentScreenIndex + 1 < screens.length) {
      setCurrentScreen(currentScreenIndex + 1);
    }
  };

  async function onJoinCommunity() {
    if (!user) {
      showLoginModal();
    } else {
      setJoinCommunity(true);
      setJoinEvent(false);
      showPaymentModal();
    }
    if (!isSignupButtonClick) {
      Analytics.track('Button Tapped', {
        Button: 'Join Community',
        ...(commonAnalyticsParams || {}),
      });
    }
  }

  async function onJoinEvent() {
    if (isLoading) return;
    if (!user) {
      showLoginModal();
    } else if (isFreeEvent) {
      setIsLoading(true);
      if (!isUserPurchasedEvent) {
        setTimeout(async () => {
          const response = await bookEvent(event.id);
          if (response?.error) {
            showError(t('event_error_unable_to_book_event'));
          } else {
            onNext();
          }
          setIsLoading(false);
        }, 4000);
      } else {
        setIsLoading(false);
        onNext();
      }
    } else {
      setJoinEvent(true);
      setJoinCommunity(false);
      showPaymentModal();
    }
    if (!isSignupButtonClick) {
      Analytics.track('Button Tapped', {
        Button: 'Purchase Event',
        ...(commonAnalyticsParams || {}),
      });
    }
  }

  useTrackPageView(
    {
      'Coach ID': coach?.id,
      'Coach Name': getCoachName(coach),
      'Community ID': community?.id,
      'Community Name': community?.name,
      'Event ID': event?.id,
      'Event Name': event?.title,
    },
    [coach, event]
  );

  const handleButtonClick = async () => {
    if (isLoading) return;
    if (
      !isEventPartOfCommunity ||
      isUserSubscriber ||
      (isFreeEvent && !isExclusiveToCommunity)
    ) {
      onJoinEvent();
    } else {
      onJoinCommunity();
    }
  };

  useEffect(() => {
    if (
      user &&
      isSignupButtonClick &&
      ((!isUserSubscriber && isEventPartOfCommunity) || !isUserPurchasedEvent)
    ) {
      handleButtonClick();
    }
  }, [
    isSignupButtonClick,
    isUserSubscriber,
    isUserPurchasedEvent,
    user,
    isEventPartOfCommunity,
  ]);

  return (
    <div
      className={classNames(
        'w-100 col align-center',
        styles.defaultBackground,
        {
          'light-theme': !isDark,
          'dark-theme': isDark,
          [styles.sucessScreenBackground]:
            screens[currentScreenIndex] === 'congrats',
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
              community={community}
              event={event}
              tab={screens[currentScreenIndex]}
              eventCoach={eventCoach}
              onJoinCommunity={onJoinCommunity}
              onJoinEvent={onJoinEvent}
              user={user}
              isUserSubscriber={isUserSubscriber}
              isUserPurchasedEvent={isUserPurchasedEvent}
              isPastEvent={isPastEvent}
              isEventPartOfCommunity={isEventPartOfCommunity}
              isLoginModalVisible={isLoginModalVisible}
              isPaymentModalVisible={isPaymentModalVisible}
              onNext={onNext}
              isFreeEvent={isFreeEvent}
              isLoading={isLoading}
            />

            <EventPaymentModal
              ref={paymentModalRef}
              event={event}
              community={community}
              eventCoach={eventCoach}
              joinCommunity={joinCommunity}
              joinEvent={joinEvent}
              isPastEvent={isPastEvent}
              isUserSubscriber={isUserSubscriber}
              isUserPurchasedEvent={isUserPurchasedEvent}
              isEventPartOfCommunity={isEventPartOfCommunity}
              onClose={closePaymentModal}
              onNext={onNext}
              isFreeEvent={isFreeEvent}
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
      return <EventLandingPage {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
