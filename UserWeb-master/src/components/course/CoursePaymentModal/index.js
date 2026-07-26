import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import useCoursePayment from '@/hooks/coursePayment';
import useTranslations from '@/hooks/translations';
import CommunityExclusiveCourseEventPurchase from '@/components/eventCourse/paymentModal/CommunityExclusiveCourseEventPurchase';
import CommunityPurchase from '@/components/eventCourse/paymentModal/CommunityPurchase';

import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import useAuthUser from '../../../hooks/authUser';
import CommunityMemberCoursePurchase from './CommunityMemberCoursePurchase';
import CoursePurchaseWithCommunity from './CoursePurchaseWithCommunity';
import styles from './styles.module.scss';

function CoursePaymentModal(
  {
    course,
    community,
    courseCoach,
    joinCommunity,
    joinCourse,
    isUserSubscriber,
    isCoursePartOfCommunity,
    isUserPurchasedCourse,
    onClose,
    onNext,
  },
  ref
) {
  const isExclusiveToCommunity = course?.exclusiveToCommunity;
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuthUser();
  const stripe = useStripe();
  const [amount, setAmount] = useState(
    isExclusiveToCommunity ? course.communityPrice : 0
  );
  const [coursePaymentType, setCoursePaymentType] = useState('course');

  const { handleSubmit, showUserError, isProcessing } = useCoursePayment({
    amount,
    course,
    community,
    stripe,
    onSuccessfulPurchase: () => {
      onNext();
      hide();
    },
    coursePaymentType,
    onSubscriptionPollFail: () => {
      window.location.reload();
    },
  });
  useEffect(() => {
    if (user) {
      hide();
    }
  }, [user]);

  useEffect(() => {
    if (isExclusiveToCommunity && !isUserSubscriber) {
      setCoursePaymentType('communityWithCourse');
    }
    if (isCoursePartOfCommunity && isUserPurchasedCourse && !isUserSubscriber) {
      setCoursePaymentType('community');
    }
  }, [
    isExclusiveToCommunity,
    isCoursePartOfCommunity,
    isUserPurchasedCourse,
    isUserSubscriber,
  ]);

  function show() {
    setIsVisible(true);
  }
  function hide() {
    setIsVisible(false);
  }
  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));
  if (!isVisible) {
    return null;
  }

  const handleAmountChange = (newAmount) => {
    setAmount(newAmount);
  };

  const handleCoursePaymentTypeChange = (type) => {
    setCoursePaymentType(type);
  };

  const renderPurchaseOption = () => {
    if (!isCoursePartOfCommunity || isUserSubscriber)
      return (
        <CommunityMemberCoursePurchase
          onClose={onClose}
          course={course}
          courseCoach={courseCoach}
          handleSubmit={handleSubmit}
          onAmountChange={handleAmountChange}
          isProcessing={isProcessing}
          isUserSubscriber={isUserSubscriber}
          isCoursePartOfCommunity={isCoursePartOfCommunity}
          community={community}
        />
      );
    if (isExclusiveToCommunity)
      return (
        <CommunityExclusiveCourseEventPurchase
          onClose={onClose}
          title={course.name}
          headerImage={course.image}
          subtitle={t('event_course_payment_modal_exclusive_for_member', {
            type: t('text_course', { count: 1 }),
          })}
          pricingText={t(
            course?.communityPrice > 0
              ? 'course_purchase_card_exclusive_member_price'
              : 'course_purchase_card_exclusive_member_only_community_price',
            {
              coursePrice: I18NFormatter.formatCurrency(
                convertToDollar(course.communityPrice),
                { maximumFractionDigits: 0 }
              ),
              communityPrice: I18NFormatter.formatCurrency(
                convertToDollar(community.price),
                { maximumFractionDigits: 0 }
              ),
            }
          )}
          community={community}
          coach={courseCoach}
          joinCommunity={joinCommunity}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          showUserError={showUserError}
          onAmountChange={handleAmountChange}
          isUserSubscriber={isUserSubscriber}
        />
      );
    if (isCoursePartOfCommunity && !isUserSubscriber && isUserPurchasedCourse)
      return (
        <CommunityPurchase
          onClose={onClose}
          community={community}
          coach={courseCoach}
          joinCommunity={joinCommunity}
          handleSubmit={handleSubmit}
          isProcessing={isProcessing}
          showUserError={showUserError}
          onAmountChange={handleAmountChange}
          isUserSubscriber={isUserSubscriber}
        />
      );

    return (
      <CoursePurchaseWithCommunity
        onClose={onClose}
        course={course}
        community={community}
        courseCoach={courseCoach}
        joinCommunity={joinCommunity}
        joinCourse={joinCourse}
        handleSubmit={handleSubmit}
        isProcessing={isProcessing}
        showUserError={showUserError}
        isUserPurchasedCourse={isUserPurchasedCourse}
        isUserSubscriber={isUserSubscriber}
        onAmountChange={handleAmountChange}
        onCoursePaymentTypeChange={handleCoursePaymentTypeChange}
      />
    );
  };
  return (
    <div
      className={styles.paymentModal}
      style={{
        alignItems:
          isCoursePartOfCommunity &&
          !isUserSubscriber &&
          !isUserPurchasedCourse &&
          !isExclusiveToCommunity
            ? 'flex-start'
            : 'center',
      }}>
      {renderPurchaseOption()}
    </div>
  );
}

export default forwardRef(CoursePaymentModal);
