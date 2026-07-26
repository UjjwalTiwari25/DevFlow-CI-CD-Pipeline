import AuraButton from '@/components/app/AuraButton';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import Analytics from '@/services/Analytics';
import useTranslations from '@/hooks/translations';
import React, { useState } from 'react';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import { MdClose } from 'react-icons/md';
import styles from './styles.module.scss';

function CoursePurchaseWithCommunity({
  onClose,
  course,
  courseCoach,
  community,
  joinCommunity,
  joinCourse,
  handleSubmit,
  onAmountChange,
  onCoursePaymentTypeChange,
  isUserPurchasedCourse,
  isProcessing,
  isUserSubscriber,
}) {
  const [isNonMemberChecked, setIsNonMemberChecked] = useState(joinCourse);
  const [isJoinCommunityChecked, setIsJoinCommunityChecked] =
    useState(joinCommunity);

  const { t } = useTranslations();

  const isCommunityExclusive = course.exclusiveToCommunity;

  if (isNonMemberChecked) {
    onAmountChange(course.price);
    onCoursePaymentTypeChange('course');
  } else if (isJoinCommunityChecked) {
    onAmountChange(course.communityPrice);
    onCoursePaymentTypeChange('communityWithCourse');
    if (isUserPurchasedCourse) {
      onCoursePaymentTypeChange('community');
    }
  }

  const totalEstimatedValue = community?.offerings
    ? community?.offerings.reduce((acc, offer) => acc + offer.estimatedValue, 0)
    : 0;

  const handleButtonClick = () => {
    Analytics.track('Purchase Button Tapped', {
      Button: 'Confirm Purchase',
      'Course Name': course?.name,
      'Course ID': course?.id,
      'Coach Name': courseCoach?.name,
      'Coach ID': courseCoach?.id,
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
    <div className={`w-100 card component-shadow ${styles.paymentCard}`}>
      <div className={styles.courseHeader}>
        <div className={styles.courseName}>{course.name}</div>
        <div className={styles.courseDescription}>
          {t('course_payment_modal_course_by', {
            courseCoachName: courseCoach.name,
          })}
        </div>

        {isCommunityExclusive && (
          <div className={styles.exclusiveCommunitySection}>
            <div className={styles.exclusiveCommunityText}>
              {t('course_community_exclusive_text')}
            </div>
            <div className={styles.exclusiveCommunitySub}>
              {t('course_community_exclusive_join')}
            </div>
          </div>
        )}
      </div>
      {onClose && (
        <div className={`${styles.closeIcon} clickable`} onClick={onClose}>
          <MdClose />
        </div>
      )}

      {!isCommunityExclusive && !isUserPurchasedCourse && (
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
              className={`${styles.checkbox} clickable ${isNonMemberChecked && styles.gradientBackground}`}
            />
            <div className={styles.nonMemberTicketText}>
              {t('course_payment_modal_course_only')}
            </div>
          </div>
          <div className={styles.nonMembersPrice}>
            {I18NFormatter.formatCurrency(convertToDollar(course.price), {
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
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
              className={`${styles.checkbox} clickable ${isJoinCommunityChecked && styles.gradientBackground}`}
            />
            <div className={styles.joinCommunityText}>
              {t('course_join_community')}
            </div>
          </div>
          <div className={styles.joinCommunityBestValue}>
            <div className={styles.joinCommunityBestValueText}>
              {t('course_best_value')}
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
                      { maximumFractionDigits: 0 }
                    )}
                  </div>
                </div>
              );
            })}
          <div className={styles.horizontalRow}></div>
          <div className={styles.totalValue}>
            <div className={styles.totalValueText}>
              {t('course_payment_modal_total_value')}
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
              {t('course_payment_modal_your_cost')}
            </div>
            <div className={styles.yourCostPerMonth}>
              {course?.communityPrice > 0 && !isUserPurchasedCourse ? (
                <>
                  {t('course_community_price_per_month_combined', {
                    coursePrice: I18NFormatter.formatCurrency(
                      convertToDollar(course.communityPrice),
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
                  {t('course_community_price_per_month', {
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
            {t('course_payment_modal_course_only')}
          </div>
        )}
        {isJoinCommunityChecked && (
          <div className={styles.cardDetailCheckedText}>
            {t('course_community_membership', {
              communityName: community && community.name,
            })}
          </div>
        )}

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
              {t('course_payment_modal_protected_payment')}
            </div>
          </div>
        </div>
        <div className={styles.paymentCardInput}>
          <CoachingCardInput disabled={isProcessing} isUsedInCommunityPayment />
        </div>
      </div>

      <AuraButton
        title={
          isCommunityExclusive
            ? t('course_join_community')
            : t('course_payment_modal_confirm_purchase')
        }
        withNewShadow
        style={{
          width: '100%',
          maxHeight: 72,
          marginTop: 18,
          padding: '25px 32px',
        }}
        textStyle={{ fontSize: 16, fontWeight: 700 }}
        horizontalGradient
        onClick={handleButtonClick}
        loading={isProcessing}
      />

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
    </div>
  );
}

export default CoursePurchaseWithCommunity;
