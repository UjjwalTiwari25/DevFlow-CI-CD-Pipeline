import React, { useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import Analytics from '@/services/Analytics';
import AuraButton from '@/components/app/AuraButton';
import CoachingCardInput from '@/components/payment/clean/CoachingCardInput';
import {
  getCommunityMemberCoursePrice,
  getCommunityMemberCourseDiscount,
} from '@/models/course';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import styles from './styles.module.scss';

export default function CommunityMemberCoursePurchase({
  onClose,
  course,
  courseCoach,
  community,
  handleSubmit,
  onAmountChange,
  isProcessing,
  isCoursePartOfCommunity,
  isUserSubscriber,
}) {
  const { t } = useTranslations();
  const isExclusiveToCommunity = course?.exclusiveToCommunity;

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
      'Purchase Plan': 'Member Plan',
      'Payment Method': 'Card',
    });
    handleSubmit();
  };

  useEffect(() => {
    onAmountChange(
      isCoursePartOfCommunity
        ? getCommunityMemberCoursePrice(course) * 100
        : course.price
    );
  }, []);

  const renderCoursePrice = () => {
    if (!isCoursePartOfCommunity) {
      return (
        <div className={styles.coursePrice}>
          {I18NFormatter.formatCurrency(convertToDollar(course.price), {
            maximumFractionDigits: 0,
          })}
        </div>
      );
    }

    if (isExclusiveToCommunity) {
      return (
        <div className={styles.coursePrice}>
          {I18NFormatter.formatCurrency(getCommunityMemberCoursePrice(course), {
            maximumFractionDigits: 0,
          })}
        </div>
      );
    }

    return (
      <>
        <div className={styles.coursePrice}>
          <span>
            {I18NFormatter.formatCurrency(
              getCommunityMemberCoursePrice(course),
              {
                maximumFractionDigits: 0,
              }
            )}
          </span>
          <span className={styles.originalValueStrike}>
            {I18NFormatter.formatCurrency(convertToDollar(course.price), {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className={styles.discountText}>
          <Trans
            ns="course"
            i18nKey={'course_purchase_community_member_discount'}
            components={[
              <span key="discount-text" className={styles.discount}></span>,
            ]}
            values={{
              discountPrice: I18NFormatter.formatCurrency(
                getCommunityMemberCourseDiscount(course),
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
      <div className={styles.courseHeader}>
        <img
          alt="course image"
          src={course.image}
          width={60}
          height={60}
          style={{ borderRadius: 10 }}
        />

        <div className={styles.courseName}>{course.name}</div>
        <div className={styles.courseDescription}>
          {t('course_payment_modal_course_by', {
            courseCoachName: courseCoach.name,
          })}
        </div>
      </div>
      {onClose && (
        <div className={`${styles.closeIcon} clickable`} onClick={onClose}>
          <MdClose />
        </div>
      )}

      <div className={styles.coursePriceDetails}>{renderCoursePrice()}</div>
      <div className={styles.cardWrapper}>
        <CoachingCardInput disabled={isProcessing} isUsedInCommunityPayment />
      </div>
      <AuraButton
        title={t('course_payment_modal_confirm_purchase')}
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
