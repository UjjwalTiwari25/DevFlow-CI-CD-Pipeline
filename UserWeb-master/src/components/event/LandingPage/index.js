import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { ButtonCenter } from '@aurahealth/web-design-system';
import NewFooter from '@/components/app/NewFooter';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import EventOrCoursePaymentCard from '@/components/eventCourse/EventOrCoursePaymentCard';
import EventOrCoursePurchaseOptionFooter from '@/components/eventCourse/EventorCoursePurchaseOptionFooter';
import { getCommunityMemberEventDiscount } from '@/models/event';
import useTranslations from '@/hooks/translations';
import useEventDeeplink from '@/hooks/eventDeeplink';
import communityContants from '@/utils/constants/community';
import EventInfo from './EventInfo';
import EventHeader from './EventHeader';
import styles from './styles.module.scss';
import JoinCommunityOrEventButton from './JoinCommunityOrEventButton';

function EventLandingPage({
  community,
  event,
  eventCoach,
  onJoinCommunity,
  onJoinEvent,
  isPastEvent,
  isUserSubscriber,
  isUserPurchasedEvent,
  isLoginModalVisible,
  isPaymentModalVisible,
  isEventPartOfCommunity,
  onNext,
  isFreeEvent,
  isLoading,
}) {
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();
  const isExclusiveToCommunity = event.exclusiveToCommunity;
  const { deeplink } = useEventDeeplink({ event, eventCoach });

  const [showButton, setShowButton] = useState(false);

  const handleButtonClick = async () => {
    if (
      !isEventPartOfCommunity ||
      isUserSubscriber ||
      (isFreeEvent && !isExclusiveToCommunity && !isUserPurchasedEvent)
    ) {
      onJoinEvent();
    } else {
      onJoinCommunity();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const renderJoinCommunityOrEventButton = () => {
    if (isFreeEvent && !isUserPurchasedEvent) {
      return (
        <ButtonCenter
          disable={isLoading}
          height="large"
          type="cta-blue"
          text={
            isPastEvent ? t('event_watch_recording') : t('button_join_for_free')
          }
          style={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: '25px',
            textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
            width: '100%',
            marginTop: 20,
          }}
          onClick={handleButtonClick}
        />
      );
    }
    if (!(
      (isUserPurchasedEvent || isPastEvent) &&
      (isUserSubscriber || !isEventPartOfCommunity)
    ))
      return (
        <JoinCommunityOrEventButton
          style={{
            width: '100%',
            marginTop: 20,
          }}
          onClick={handleButtonClick}
          isEventPartOfCommunity={isEventPartOfCommunity}
          isUserSubscriber={isUserSubscriber}
          isFreeEvent={isFreeEvent}
        />
      );
    return null;
  };

  return (
    <div className={styles.eventPageContentWrapper}>
      <EventHeader
        event={event}
        handleButtonClick={handleButtonClick}
        isUserSubscriber={isUserSubscriber}
        isUserPurchasedEvent={isUserPurchasedEvent}
        isPastEvent={isPastEvent}
        isEventPartOfCommunity={isEventPartOfCommunity}
        renderJoinCommunityOrEventButton={renderJoinCommunityOrEventButton}
      />
      <div className={styles.eventInfoWrapper}>
        <EventInfo
          event={event}
          onJoinCommunity={onJoinCommunity}
          onJoinEvent={onJoinEvent}
          isUserSubscriber={isUserSubscriber}
          isUserPurchasedEvent={isUserPurchasedEvent}
          isPastEvent={isPastEvent}
          isEventPartOfCommunity={isEventPartOfCommunity}
          community={community}
          eventCoach={eventCoach}
          onNext={onNext}
          isFreeEvent={isFreeEvent}
          handleButtonClick={handleButtonClick}
        />

        <div className={styles.eventPurchaseCardSection}>
          <EventOrCoursePaymentCard
            event={event}
            community={community}
            coach={eventCoach}
            onJoinSingleEventOrCourse={onJoinEvent}
            isPastEvent={isPastEvent}
            isUserAlreadyPurchased={isUserPurchasedEvent}
            isUserSubscriber={isUserSubscriber}
            isPartOfCommunity={isEventPartOfCommunity}
            isExclusiveToCommunity={isExclusiveToCommunity}
            onNext={onNext}
            isFree={isFreeEvent}
            handleButtonClick={handleButtonClick}
            deeplink={deeplink}
            type={communityContants.COMMUNITY_FEATURE_TYPES.EVENT}
            eventOrCourseTitle={event.title}
            eventOrCoursePrice={event.price}
            eventOrCourseCommunityPrice={event.communityPrice}
            eventOrCourseCommunityMemberDiscount={getCommunityMemberEventDiscount(
              event
            )}
            eventOrCourseScheduledAt={event.scheduledAt}
            eventOrCourseDuration={event.duration}
            renderSubmitButton={renderJoinCommunityOrEventButton}
            isEvent={true}
          />
        </div>
      </div>

      {!isFreeEvent && (
        <div className={styles.purchaseEventSection}>
          <div className={styles.horizontalRow}></div>
          <EventOrCoursePurchaseOptionFooter
            event={event}
            community={community}
            coach={eventCoach}
            onJoinSingleEventOrCourse={onJoinEvent}
            isPastEvent={isPastEvent}
            isUserAlreadyPurchased={isUserPurchasedEvent}
            isUserSubscriber={isUserSubscriber}
            isPartOfCommunity={isEventPartOfCommunity}
            isExclusiveToCommunity={isExclusiveToCommunity}
            onNext={onNext}
            isFree={isFreeEvent}
            handleButtonClick={handleButtonClick}
            deeplink={deeplink}
            type={communityContants.COMMUNITY_FEATURE_TYPES.EVENT}
            eventOrCourseTitle={event.title}
            eventOrCoursePrice={event.price}
            eventOrCourseCommunityPrice={event.communityPrice}
            eventOrCourseCommunityMemberDiscount={getCommunityMemberEventDiscount(
              event
            )}
            renderSubmitButton={renderJoinCommunityOrEventButton}
          />
        </div>
      )}

      {!isMobile && !isFreeEvent && <NewFooter />}

      {showButton &&
        !isLoginModalVisible &&
        !isPaymentModalVisible &&
        !isUserPurchasedEvent && (
          <div
            className={classNames(
              'row align-center',
              styles.buttonContainer,
              styles.mobileOnly
            )}>
            {renderJoinCommunityOrEventButton()}
          </div>
        )}
    </div>
  );
}

export default EventLandingPage;
