import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import useTranslations from '@/hooks/translations';
import AuraButton from '@/components/app/AuraButton';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import styles from './styles.module.scss';

export default function CommunityExclusiveCourseEventPurchase({
  onClose,
  handleSubmit,
  isCardSavedToFile,
  activeCard,
  onCardChange,
  cards,
  isProcessing,
  title,
  subtitle,
  pricingText,
  headerImage,
}) {
  const { t } = useTranslations();
  const [showCards, setShowCards] = useState(false);
  const [showAddNewCard, setShowAddNewCard] = useState(false);

  return (
    <div className={`w-100 component-shadow ${styles.paymentCard}`}>
      <div className={styles.communityHeader}>
        <img
          alt="logo"
          src={headerImage}
          width={60}
          height={60}
          className={styles.communityLogo}
        />

        <div className={styles.communityName}>{title}</div>
        <div className={styles.communityDescription}>
          {subtitle && <span>{subtitle}</span>}
          <span>
            {t('event_course_payment_modal_join_community_to_get_access')}
          </span>
        </div>
      </div>
      {onClose && (
        <div className={`${styles.closeIcon} clickable`} onClick={onClose}>
          <MdClose />
        </div>
      )}

      <div className={styles.communityPriceDetails}>
        <div className={styles.communityPrice}>{pricingText}</div>
        <div className={styles.communityPrice}>{t('text_cancel_anytime')}</div>
      </div>
      {isCardSavedToFile && !showCards && !showAddNewCard && (
        <div>
          <div className={styles.savedCardInput}>
            <img
              src="/static/images/visa-logo.png"
              alt="visa"
              className={styles.cardLogo}
            />
            <div className={styles.cardHiddenNumber}>
              <div className={styles.hiddenDots}>{`●●●● ●●●● ●●●● `}</div>&nbsp;
              <div>{activeCard?.last4}</div>
            </div>
          </div>

          <div
            className={styles.changePaymentMethod}
            onClick={() => setShowCards(true)}>
            {t('community_payment_modal_change_payment_method')}
          </div>
        </div>
      )}

      {showCards && (
        <div>
          {cards?.slice(0, 4)?.map((card) => (
            <div
              className={styles.savedCardInput}
              key={card?.id}
              onClick={() => {
                setShowCards(false);
                onCardChange(card);
              }}>
              <img
                src="/static/images/visa-logo.png"
                alt="visa"
                className={styles.cardLogo}
              />
              <div className={styles.cardHiddenNumber}>
                <div className={styles.hiddenDots}>{`●●●● ●●●● ●●●● `}</div>
                &nbsp;
                <div>{card?.last4}</div>
              </div>
            </div>
          ))}
          <div
            className={styles.addNewCard}
            onClick={() => {
              setShowAddNewCard(true);
              setShowCards(false);
            }}>
            {t('community_payment_modal_add_new_card')}
          </div>
        </div>
      )}
      {((!isCardSavedToFile && !showCards) || showAddNewCard) && (
        <div>
          <div className={styles.cardInput}>
            <CoachingCardInput isUsedInCommunityPayment />
          </div>

          {showAddNewCard && (
            <div
              className={styles.changePaymentMethod}
              onClick={() => {
                setShowCards(true);
                setShowAddNewCard(false);
              }}>
              {t('community_payment_modal_back_to_cards')}
            </div>
          )}
        </div>
      )}

      {((isCardSavedToFile && !showCards) ||
        (!isCardSavedToFile && !showCards && !showAddNewCard)) && (
        <AuraButton
          title={t('button_join_community')}
          withNewShadow
          style={{
            width: '100%',
            maxHeight: 72,
            marginTop: 16,
            padding: '25px 32px',
          }}
          textStyle={{ fontSize: 16, fontWeight: 700 }}
          horizontalGradient
          onClick={handleSubmit}
          loading={isProcessing}
        />
      )}
      <div className={styles.guidelinesWrapper}>
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
    </div>
  );
}
