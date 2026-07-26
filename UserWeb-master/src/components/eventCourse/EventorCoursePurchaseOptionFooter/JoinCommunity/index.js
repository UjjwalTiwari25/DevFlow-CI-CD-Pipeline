import React from 'react';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useTranslations from '@/hooks/translations';
import { ButtonCenter } from '@aurahealth/web-design-system';
import I18NFormatter from '@/services/I18NFormatter';
import { getTypeTitle } from '@/utils/community';
import { convertToDollar } from '@/utils';
import communityContants from '@/utils/constants/community';
import styles from './styles.module.scss';

function JoinCommunity({
  isUserAlreadyPurchased,
  type,
  community,
  coach,
  onJoinSingleEventOrCourse,
  isUserSubscriber,
  isExclusiveToCommunity,
  handleButtonClick,
  eventOrCourseTitle,
  eventOrCoursePrice,
  isPastEvent,
}) {
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();

  const totalEstimatedValue = community?.offerings
    ? community?.offerings.reduce((acc, offer) => acc + offer.estimatedValue, 0)
    : 0;

  return (
    <div className={styles.purchaseOptionWrapper}>
      {!isExclusiveToCommunity && !isUserAlreadyPurchased && !isPastEvent && (
        <div className={styles.coursePurchaseWrapper}>
          <div className={styles.coursePurchaseSection}>
            <div className={styles.coursePurchaseName}>
              {eventOrCourseTitle}
            </div>
            <div className={styles.coursePurchaseText}>
              {t('purchase_card_purchase_for', {
                type: t(getTypeTitle(type), { count: 1 }),
              })}
            </div>
            <div className={styles.coursePurchasePrice}>
              {I18NFormatter.formatCurrency(
                convertToDollar(eventOrCoursePrice),
                {
                  maximumFractionDigits: 0,
                }
              )}
            </div>
          </div>

          <div
            className={styles.coursePurchaseButton}
            onClick={onJoinSingleEventOrCourse}>
            <div className={styles.coursePurchaseButtonText}>
              {t(
                type === communityContants.COMMUNITY_FEATURE_TYPES.COURSE
                  ? 'course_purchase_single_course'
                  : 'event_purchase_card_purchase_single_event'
              )}
            </div>
          </div>

          <div className={styles.horizontalRowOr}>
            <div className={styles.orHorizontalRow}></div>
            {t('text_or')}
            <div className={styles.orHorizontalRow}></div>
          </div>
        </div>
      )}

      <div className={styles.communityTableCard}>
        <div className={styles.joinCommunityText}>
          {t('purchase_card_coach_community', {
            coachName: coach.name,
          })}
        </div>

        <div className={styles.communityOfferingsTable}>
          {!isMobile && (
            <div className={styles.communityOfferingsSection}>
              <div className={styles.offeringsHeadingOne}>
                {t('community_included_membership')}
              </div>
              <div className={styles.offeringsHeadingTwo}>
                {t('text_join_value')}
              </div>
            </div>
          )}
          {community?.offerings?.map((offer, index) => {
            return (
              <div key={index} className={styles.communityOfferingsSection}>
                <div className={styles.offerTitle}>{offer.title}</div>
                <div className={styles.offerValue}>
                  {I18NFormatter.formatCurrency(
                    convertToDollar(offer.estimatedValue),
                    { maximumFractionDigits: 0 }
                  )}
                </div>
              </div>
            );
          })}
          <hr className={styles.offeringsTableDivider} />
          <div className={styles.communityOfferingsSection}>
            <div className={styles.totalValueText}>
              {t('purchase_card_total_value')}
            </div>
            <div className={styles.totalValueStrike}>
              {I18NFormatter.formatCurrency(
                convertToDollar(totalEstimatedValue),
                {
                  maximumFractionDigits: 0,
                }
              )}
            </div>
          </div>
          <div className={styles.communityOfferingsSection}>
            <div className={styles.yourCostText}>
              {t('purchase_card_your_cost')}
            </div>
            <div className={styles.yourCostPerMonth}>
              {t('community_price_per_month', {
                communityPrice: I18NFormatter.formatCurrency(
                  convertToDollar(community?.price),
                  {
                    maximumFractionDigits: 0,
                  }
                ),
              })}
            </div>
          </div>
        </div>
      </div>
      {!isUserSubscriber && (
        <div className={styles.joinCommunityButton}>
          <ButtonCenter
            text={t('button_join_community')}
            height="large"
            withNewShadow
            textWeight="bold"
            style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: '25px',
              textShadow: '0px 4px 14px rgba(0, 0, 0, 0.15)',
              width: '100%',
            }}
            type="cta-blue"
            onClick={handleButtonClick}
          />
        </div>
      )}
    </div>
  );
}

export default JoinCommunity;
