import React, { useState } from 'react';
import { toZonedTime } from 'date-fns-tz';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import Analytics from '@/services/Analytics';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import { MdClose } from 'react-icons/md';
import I18NFormatter from '@/services/I18NFormatter';
import useAuthUser from '@/hooks/authUser';
import { convertToDollar } from '@/utils';
import classNames from 'classnames';
import styles from './styles.module.scss';

function EventPurchaseWithCommunity({
  onClose,
  event,
  eventCoach,
  community,
  joinCommunity,
  joinEvent,
  isPastEvent,
  handleSubmit,
  onAmountChange,
  onEventPaymentTypeChange,
  isUserPurchasedEvent,
  isProcessing,
  isFreeEvent,
  isUserSubscriber,
}) {
  const { user } = useAuthUser();
  const { timezone = 'America/New_York' } = user || {};
  const [isNonMemberChecked, setIsNonMemberChecked] = useState(joinEvent);
  const [isJoinCommunityChecked, setIsJoinCommunityChecked] =
    useState(joinCommunity);
  const { t } = useTranslations();
  const isCommunityExclusive = event.exclusiveToCommunity;

  if (isNonMemberChecked) {
    onAmountChange(event.price);
    onEventPaymentTypeChange('event');
  } else if (isJoinCommunityChecked) {
    onAmountChange(event.communityPrice);
    onEventPaymentTypeChange('communityWithEvent');
    if (isUserPurchasedEvent) {
      onEventPaymentTypeChange('community');
    }
  }

  const totalEstimatedValue = community?.offerings
    ? community?.offerings.reduce(
        (acc, offer) => acc + Number(offer.estimatedValue),
        0
      )
    : 0;

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
      'Purchase Plan': isNonMemberChecked
        ? 'Non Member Plan'
        : 'Join community Plan',
      'Payment Method': 'Card',
    });
    handleSubmit();
  };

  return (
    <div
      className={classNames(
        'w-100',
        'card',
        'component-shadow',
        styles.paymentCard
      )}>
      <div className={styles.eventHeader}>
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

        {isCommunityExclusive && (
          <div className={styles.exclusiveCommunitySection}>
            <div className={styles.exclusiveCommunityText}>
              {t('event_community_exclusive_text')}
            </div>
            <div className={styles.exclusiveCommunitySub}>
              {t('event_community_exclusive_join')}
            </div>
          </div>
        )}
      </div>
      {onClose && (
        <div
          className={classNames(styles.closeIcon, 'clickable')}
          onClick={onClose}>
          <MdClose />
        </div>
      )}

      {!isPastEvent && (
        <>
          {!isCommunityExclusive && !isUserPurchasedEvent && (
            <div
              className={styles.nonMemberTicketRadio}
              onClick={() => {
                // eslint-disable-next-line no-unused-expressions
                isNonMemberChecked
                  ? setIsNonMemberChecked(isNonMemberChecked)
                  : setIsNonMemberChecked(!isNonMemberChecked);
                setIsJoinCommunityChecked(false);
              }}>
              <div className={styles.checkboxWrapper}>
                <div
                  className={classNames(styles.checkbox, 'clickable', {
                    [styles.gradientBackground]: isNonMemberChecked,
                  })}
                />
                <div className={styles.nonMemberTicketText}>
                  {t('event_payment_event_only')}
                </div>
              </div>
              <div className={styles.nonMembersPrice}>
                {I18NFormatter.formatCurrency(convertToDollar(event.price), {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div
        className={styles.joinCommunityRadioWrapper}
        onClick={() => {
          // eslint-disable-next-line no-unused-expressions
          isJoinCommunityChecked
            ? setIsJoinCommunityChecked(isJoinCommunityChecked)
            : setIsJoinCommunityChecked(!isJoinCommunityChecked);
          setIsNonMemberChecked(false);
        }}>
        <div className={styles.joinCommunityRadio}>
          <div className={styles.checkboxWrapper}>
            <div
              className={classNames(styles.checkbox, 'clickable', {
                [styles.gradientBackground]: isJoinCommunityChecked,
              })}
            />
            <div className={styles.joinCommunityText}>
              {t('event_payment_modal_join_community')}
            </div>
          </div>
          <div className={styles.joinCommunityBestValue}>
            <div className={styles.joinCommunityBestValueText}>
              {t('event_payment_modal_best_value')}
            </div>
          </div>
        </div>
        <div className={styles.horizontalRow}></div>
        <div className={styles.communityOfferingWrapper}>
          {community.offerings &&
            community.offerings.map((offer, index) => {
              return (
                <div key={index} className={styles.communityOfferingsSection}>
                  <div className={styles.offerTitle}>{offer.title}</div>
                  <div className={styles.offerValue}>
                    {I18NFormatter.formatCurrency(
                      convertToDollar(offer.estimatedValue),
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </div>
                </div>
              );
            })}
          <div className={styles.horizontalRow}></div>
          <div className={styles.totalValue}>
            <div className={styles.totalValueText}>
              {t('purchase_card_total_value')}
            </div>
            <div className={styles.totalValueStrike}>
              {I18NFormatter.formatCurrency(
                convertToDollar(totalEstimatedValue),
                { maximumFractionDigits: 0 }
              )}
            </div>
          </div>
          <div className={styles.yourCost}>
            <div className={styles.yourCostText}>
              {t('purchase_card_your_cost')}
            </div>
            <div className={styles.yourCostPerMonth}>
              {!isPastEvent &&
              event?.communityPrice > 0 &&
              !isUserPurchasedEvent ? (
                <>
                  {t('event_payment_modal_community_price_combined', {
                    eventPrice: I18NFormatter.formatCurrency(
                      convertToDollar(event.communityPrice),
                      { maximumFractionDigits: 0 }
                    ),
                    communityPrice: I18NFormatter.formatCurrency(
                      convertToDollar(community.price),
                      { maximumFractionDigits: 0 }
                    ),
                  })}
                </>
              ) : (
                <>
                  {t('event_payment_modal_community_price', {
                    communityPrice: I18NFormatter.formatCurrency(
                      convertToDollar(community.price),
                      { maximumFractionDigits: 0 }
                    ),
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.cardDetailSection}>
        {isNonMemberChecked && (
          <div className={styles.cardDetailCheckedText}>
            {t('event_payment_event_only')}
          </div>
        )}
        {isJoinCommunityChecked && (
          <div className={styles.cardDetailCheckedText}>
            {t('event_payment_modal_community_membership', {
              communityName: community && community.name,
            })}
          </div>
        )}
        {isNonMemberChecked && isFreeEvent ? null : (
          <>
            <div className={styles.creditCardSection}>
              <div>
                <img
                  className={styles.creditCardsImage}
                  src="/static/images/creditCards.png"
                  alt="credit cards"
                />
              </div>
              <div className={styles.paymentProtected}>
                <img
                  className={styles.paymentProtectedIcon}
                  src="/static/images/icons/protected.png"
                  alt="protected"
                />
                <div className={styles.paymentProtectedText}>
                  {t('event_payment_modal_protected_payment')}
                </div>
              </div>
            </div>
            <div className={styles.paymentCardInput}>
              <CoachingCardInput disabled={false} isUsedInCommunityPayment />
            </div>
          </>
        )}
        <AuraButton
          title={
            isCommunityExclusive
              ? t('event_payment_modal_join_community')
              : t('event_payment_modal_button_confirm_purchase')
          }
          withNewShadow
          style={{
            width: '100%',
            maxHeight: 72,
            marginTop: 16,
            padding: '25px 32px',
          }}
          textStyle={{ fontSize: 16, fontWeight: 700 }}
          horizontalGradient
          onClick={handleButtonClick}
          loading={isProcessing}
        />
      </div>

      {isNonMemberChecked && isFreeEvent ? null : (
        <div>
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
        </div>
      )}
    </div>
  );
}

export default EventPurchaseWithCommunity;
