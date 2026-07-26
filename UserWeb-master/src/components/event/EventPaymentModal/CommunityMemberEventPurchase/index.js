import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { toZonedTime } from 'date-fns-tz';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import { convertToDollar } from '@/utils';
import Analytics from '@/services/Analytics';
import I18NFormatter from '@/services/I18NFormatter';
import {
  getCommunityMemberEventPrice,
  getCommunityMemberEventDiscount,
} from '@/models/event';
import useAuthUser from '@/hooks/authUser';
import styles from './styles.module.scss';

export default function CommunityMemberEventPurchase({
  onClose,
  event,
  community,
  eventCoach,
  handleSubmit,
  onAmountChange,
  isProcessing,
  isEventPartOfCommunity,
  isFreeEvent,
  isUserSubscriber,
}) {
  const { user } = useAuthUser();
  const { timezone = 'America/New_York' } = user || {};
  const { t } = useTranslations();

  useEffect(() => {
    onAmountChange(
      isEventPartOfCommunity
        ? getCommunityMemberEventPrice(event) * 100
        : event.price
    );
  }, [event, isEventPartOfCommunity, onAmountChange]);

  const isExclusiveToCommunity = event?.exclusiveToCommunity;

  const handleButtonClick = () => {
    Analytics.track('Purchase Button Tapped', {
      Button: 'Confirm Purchase',
      'Event Name': event?.name,
      'Event ID': event?.id,
      'Coach Name': eventCoach?.name,
      'Coach ID': eventCoach?.id,
      'Community Name': community?.name,
      'Community ID': community?.id,
      'Community Membership Status': isUserSubscriber
        ? 'Subscriber'
        : 'Not Subscribed',
      'Purchase Plan': 'Member Plan',
      'Payment Method': 'Card',
    });
    handleSubmit();
  };

  const renderEventPrice = () => {
    if (!isEventPartOfCommunity) {
      return (
        <div className={styles.eventPrice}>
          {I18NFormatter.formatCurrency(convertToDollar(event.price), {
            maximumFractionDigits: 0,
          })}
        </div>
      );
    }

    if (isExclusiveToCommunity) {
      return (
        <div className={styles.eventPrice}>
          {I18NFormatter.formatCurrency(getCommunityMemberEventPrice(event), {
            maximumFractionDigits: 0,
          })}
        </div>
      );
    }

    return (
      <>
        <div className={styles.eventPrice}>
          {I18NFormatter.formatCurrency(getCommunityMemberEventPrice(event), {
            maximumFractionDigits: 0,
          })}
          &nbsp;
          <span className={styles.originalValueStrike}>
            {I18NFormatter.formatCurrency(convertToDollar(event.price), {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className={styles.discountText}>
          <Trans
            ns="event"
            i18nKey="event_payment_modal_community_member_discount"
            components={[
              <span
                className={styles.discount}
                key="community-discount"></span>,
            ]}
            values={{
              discountPrice: I18NFormatter.formatCurrency(
                getCommunityMemberEventDiscount(event),
                { maximumFractionDigits: 0 }
              ),
            }}
          />
        </div>
      </>
    );
  };

  return (
    <div className={`w-100 card component-shadow ${styles.paymentCard}`}>
      <div className={styles.eventHeader}>
        <img
          alt="event image"
          src={event.image}
          width={60}
          height={60}
          style={{ borderRadius: 10 }}
        />
        <div className={styles.eventName}>{event.title}</div>
        <div className={styles.eventDescription}>
          {t('event_payment_modal_event_by', {
            eventDate: I18NFormatter.formatDate(
              toZonedTime(event.scheduledAt, timezone),
              'MMM dd'
            ),
            eventTime: I18NFormatter.formatDate(
              toZonedTime(event.scheduledAt, timezone),
              'HH:mm zzz'
            ),
          })}
        </div>
      </div>
      {onClose && (
        <div className={`${styles.closeIcon} clickable`} onClick={onClose}>
          <MdClose />
        </div>
      )}
      {!isFreeEvent && (
        <>
          <div className={styles.eventPriceDetails}>{renderEventPrice()}</div>
          <CoachingCardInput disabled={isProcessing} isUsedInCommunityPayment />
        </>
      )}

      <AuraButton
        title={t(
          isFreeEvent
            ? 'button_confirm'
            : 'event_payment_modal_button_confirm_purchase'
        )}
        withNewShadow
        style={{
          width: '100%',
          maxHeight: 72,
          marginTop: 16,
          padding: '25px 32px',
        }}
        textStyle={{ fontSize: 16, fontWeight: 700 }}
        horizontalGradient
        loading={isProcessing}
        onClick={handleButtonClick}
      />

      {!isFreeEvent && (
        <>
          <div className={styles.acceptCommunityGuidelinesText}>
            {t('payment_modal_community_guidelines')}
          </div>
          <div className={styles.stripeSecureImageWrapper}>
            <img
              src="/static/images/coachingSession/secure.png"
              alt="aura green check"
              className={styles.stripeSecureImage}
            />
          </div>
        </>
      )}
    </div>
  );
}
