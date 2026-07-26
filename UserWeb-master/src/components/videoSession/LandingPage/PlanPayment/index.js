import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import Image from 'next/image';
import classNames from 'classnames';
import { useStripe } from '@stripe/react-stripe-js';
import { getCoachPhoto } from '@/models/coach';
import useBrowserHistory from '@/hooks/browserHistory';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import AuraButton from '@/components/app/AuraButton';
import useCoachingPlanPayment from '@/hooks/coachingPlanPayment';
import AuraRingClean from '@/components/app/AuraRingClean';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import I18NFormatter from '@/services/I18NFormatter';
import useTranslations from '@/hooks/translations';
import PlanFeatures from './PlanFeatures';
import styles from './styles.module.scss';

export default function PlanPayment({ coach, onNext, onBack }) {
  const { t } = useTranslations();
  useBrowserHistory('videoCoachingPlanPayment', true, onBack, onNext);
  const { selectedPlan } = useShallowEqualSelector(({ coaching }) => coaching);
  const stripe = useStripe();

  const { handleSubmit, loading: isProcessing } = useCoachingPlanPayment({
    coachId: coach.id,
    stripe,
    onSuccessfulCharge: () => {
      onNext();
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!selectedPlan) onBack();
  }, [selectedPlan]);

  return (
    <div className={classNames(styles.coachRowInfo, 'col align-center')}>
      <img
        src="/static/images/coachingSession/payment-background-mobile.png"
        alt="aura background"
        className={styles.paymentBackgroundMobile}
      />
      <img
        src="/static/images/videoCoaching/video-coaching-plan-bg.png"
        alt="aura background"
        className={styles.paymentBackground}
      />
      <div className={styles.contentContainer}>
        <div className={styles.sessionInfoContainer}>
          <div className={styles.sessionInfo}>
            <div className={styles.sessionMonth}>
              {t('video_coaching_payment_session_month', {
                count: selectedPlan?.numberOfSessions,
                duration: selectedPlan?.duration,
              })}
            </div>
            {selectedPlan?.discount > 0 && (
              <div className={styles.sessionDiscountText}>
                {t('video_coaching_plan_card_you_save', {
                  discount: I18NFormatter.formatCurrency(
                    parseInt(
                      selectedPlan.discount * selectedPlan.numberOfSessions,
                      10
                    ),
                    {
                      maximumFractionDigits: 0,
                    }
                  ),
                })}
              </div>
            )}
          </div>
          <div>
            <Image
              src={getCoachPhoto(coach, 'photo200Url')}
              alt={coach.name}
              width={116}
              height={116}
              style={{ borderRadius: 16, objectFit: 'cover' }}
            />
          </div>
        </div>
        <PlanFeatures coach={coach} selectedPlan={selectedPlan} />
        <div className={styles.yourPlanWrapper}>
          <div className={styles.yourPlanText}>
            {t('video_coaching_plan_text_your_plan')}
          </div>
          <div className={styles.priceArea}>
            {selectedPlan?.discount > 0 && (
              <div className={styles.discountedPrice}>
                {I18NFormatter.formatCurrency(
                  selectedPlan.price +
                    parseInt(
                      selectedPlan.discount * selectedPlan.numberOfSessions,
                      10
                    ),
                  {
                    maximumFractionDigits: 0,
                  }
                )}
              </div>
            )}
            <div className={styles.priceText}>
              &nbsp;
              {I18NFormatter.formatCurrency(selectedPlan.price, {
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>
      </div>
      <div
        className={classNames(
          styles.paymentOptionsContainer,
          'col align-center'
        )}>
        <div className={classNames(styles.paymentOptions, 'col align-center')}>
          <div className={styles.inputContainer}>
            <CoachingCardInput disabled={isProcessing} />
          </div>

          {isProcessing ? (
            <AuraRingClean size={60} />
          ) : (
            <AuraButton
              horizontalGradient
              cleanStyle
              withShadow
              textWeight="bold"
              title={t('video_coaching_plan_button_start_coaching')}
              style={{
                marginTop: 12,
                height: 55,
                minWidth: '80%',
                width: '100%',
              }}
              onClick={() => {
                handleSubmit();
              }}
            />
          )}

          <img
            src="/static/images/coachingSession/secure.png"
            alt="aura green check"
            className={styles.secureCheck}
          />
        </div>
      </div>
      <div className={styles.planTermsText}>
        <Trans
          ns="videoCoaching"
          i18nKey="video_coaching_plan_text_cancel_anytime"
          components={[
            <a
              key="privacy-policy"
              href={t('privacy_policy_link')}
              target="_blank"
              rel="noopener noreferrer"></a>,
            <a
              key="terms"
              href={t('terms_of_service_link')}
              target="_blank"
              rel="noopener noreferrer"></a>,
          ]}
          values={{
            planPrice: I18NFormatter.formatCurrency(selectedPlan.price, {
              maximumFractionDigits: 0,
            }),
          }}
        />
      </div>
    </div>
  );
}
