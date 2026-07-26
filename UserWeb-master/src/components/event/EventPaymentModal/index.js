import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import useEventPayment from '@/hooks/eventPayment';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import CommunityExclusiveCourseEventPurchase from '@/components/eventCourse/paymentModal/CommunityExclusiveCourseEventPurchase';
import CommunityPurchase from '@/components/eventCourse/paymentModal/CommunityPurchase';
import useTranslations from '@/hooks/translations';
import useAuthUser from '../../../hooks/authUser';
import CommunityMemberEventPurchase from './CommunityMemberEventPurchase';
import EventPurchaseWithCommunity from './EventPurchaseWithCommunity';
import styles from './styles.module.scss';

function EventPaymentModal(
  {
    event,
    community,
    eventCoach,
    joinCommunity,
    joinEvent,
    isPastEvent,
    isUserSubscriber,
    isUserPurchasedEvent,
    isEventPartOfCommunity,
    onClose,
    onNext,
    isFreeEvent,
  },
  ref
) {
  const { t } = useTranslations();
  const isExclusiveToCommunity = event?.exclusiveToCommunity;
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthUser();
  const stripe = useStripe();
  const [amount, setAmount] = useState(
    isExclusiveToCommunity ? event.communityPrice : 0
  );
  const [eventPaymentType, setEventPaymentType] = useState('event');
  const { handleSubmit, showUserError, isProcessing } = useEventPayment({
    isFreeEvent,
    amount,
    event,
    community,
    stripe,
    onSuccessfulPurchase: () => {
      onNext();
      toggle();
    },
    onSubscriptionPollFail: () => {
      window.location.reload();
    },
    eventPaymentType,
  });
  useEffect(() => {
    if (user) {
      setIsVisible(false);
    }
  }, [user]);

  useEffect(() => {
    if (isEventPartOfCommunity && !isUserSubscriber) {
      setEventPaymentType('communityWithEvent');
    }
    if (isEventPartOfCommunity && isUserPurchasedEvent && !isUserSubscriber) {
      setEventPaymentType('community');
    }
  }, [
    isExclusiveToCommunity,
    isEventPartOfCommunity,
    isUserPurchasedEvent,
    isUserSubscriber,
  ]);

  function toggle() {
    setIsVisible((prev) => !prev);
  }
  useImperativeHandle(ref, () => ({
    toggle,
  }));
  if (!isVisible) {
    return null;
  }

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
  };

  const handleEventPaymentTypeChange = (type) => {
    setEventPaymentType(type);
  };

  const renderPurchaseOption = () => {
    if (!isEventPartOfCommunity || isUserSubscriber)
      return (
        <CommunityMemberEventPurchase
          onClose={onClose}
          event={event}
          eventCoach={eventCoach}
          community={community}
          handleSubmit={handleSubmit}
          onAmountChange={handleAmountChange}
          isProcessing={isProcessing}
          isEventPartOfCommunity={isEventPartOfCommunity}
          isFreeEvent={isFreeEvent}
          isUserSubscriber={isUserSubscriber}
        />
      );
    if (isExclusiveToCommunity && !isPastEvent)
      return (
        <CommunityExclusiveCourseEventPurchase
          onClose={onClose}
          title={event.title}
          headerImage={event.image}
          subtitle={t('event_course_payment_modal_exclusive_for_member', {
            type: t('text_event', { count: 1 }),
          })}
          pricingText={t(
            event?.communityPrice > 0
              ? 'event_purchase_card_exclusive_member_price'
              : 'event_purchase_card_exclusive_member_only_community_price',
            {
              eventPrice: I18NFormatter.formatCurrency(
                convertToDollar(event.communityPrice),
                { maximumFractionDigits: 0 }
              ),
              communityPrice: I18NFormatter.formatCurrency(
                convertToDollar(community.price),
                { maximumFractionDigits: 0 }
              ),
            }
          )}
          event={event}
          community={community}
          coach={eventCoach}
          joinCommunity={joinCommunity}
          joinEvent={joinEvent}
          isPastEvent={isPastEvent}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          showUserError={showUserError}
          isUserPurchasedEvent={isUserPurchasedEvent}
          onAmountChange={handleAmountChange}
          onEventPaymentTypeChange={handleEventPaymentTypeChange}
          isFreeEvent={isFreeEvent}
          isUserSubscriber={isUserSubscriber}
        />
      );

    if (
      isEventPartOfCommunity &&
      !isUserSubscriber &&
      (isUserPurchasedEvent || isPastEvent)
    )
      return (
        <CommunityPurchase
          onClose={onClose}
          title={event.title}
          community={community}
          coach={eventCoach}
          joinCommunity={joinCommunity}
          joinEvent={joinEvent}
          isPastEvent={isPastEvent}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          showUserError={showUserError}
          isUserPurchasedEvent={isUserPurchasedEvent}
          onAmountChange={handleAmountChange}
          onEventPaymentTypeChange={handleEventPaymentTypeChange}
          isFreeEvent={isFreeEvent}
          isUserSubscriber={isUserSubscriber}
        />
      );
    return (
      <EventPurchaseWithCommunity
        onClose={onClose}
        event={event}
        community={community}
        eventCoach={eventCoach}
        joinCommunity={joinCommunity}
        joinEvent={joinEvent}
        isPastEvent={isPastEvent}
        handleSubmit={handleSubmit}
        isProcessing={isProcessing}
        showUserError={showUserError}
        isUserPurchasedEvent={isUserPurchasedEvent}
        onAmountChange={handleAmountChange}
        onEventPaymentTypeChange={handleEventPaymentTypeChange}
        isFreeEvent={isFreeEvent}
        isUserSubscriber={isUserSubscriber}
      />
    );
  };

  return (
    <div
      className={styles.paymentModal}
      style={{
        alignItems:
          isEventPartOfCommunity && !isUserSubscriber && !isExclusiveToCommunity
            ? 'flex-start'
            : 'center',
      }}>
      {renderPurchaseOption()}
    </div>
  );
}

export default forwardRef(EventPaymentModal);
