import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import {
  getCommunityMemberCourseDiscount,
  isCourseFree,
  joinCourse,
} from '@/models/course';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import EventOrCoursePurchaseOptionFooter from '@/components/eventCourse/EventorCoursePurchaseOptionFooter';
import EventOrCoursePaymentCard from '@/components/eventCourse/EventOrCoursePaymentCard';
import useCourseDeeplink from '@/hooks/courseDeeplink';
import communityContants from '@/utils/constants/community';
import CourseDetails from './CourseDetails';
import CourseHeader from './CourseHeader';
import NewFooter from '../../app/NewFooter';
import styles from './styles.module.scss';
import JoinCourseOrCommunityButton from './JoinCourseOrCommunityButton';

function CourseLandingPage({
  community,
  course,
  courseCoach,
  onJoinCommunity,
  onJoinCourse,
  isUserPurchasedCourse,
  isUserSubscriber,
  isCoursePartOfCommunity,
  isLoginModalVisible,
  isPaymentModalVisible,
  isFreeCourse,
  onNext,
}) {
  const [, isMobile] = useResponsiveWindow();
  const [showButton, setShowButton] = useState(false);
  const isExclusiveToCommunity = course.exclusiveToCommunity;
  const { deeplink } = useCourseDeeplink({ course, courseCoach });

  const handleButtonClick = async () => {
    if (!isCoursePartOfCommunity || isUserSubscriber) {
      if (isCourseFree(isUserSubscriber, isCoursePartOfCommunity, course)) {
        await joinCourse(course.id);
        onNext();
      } else {
        onJoinCourse();
      }
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

  const renderJoinCommunityOrCourseButton = () => {
    if (!isUserPurchasedCourse || !isUserSubscriber)
      return (
        <JoinCourseOrCommunityButton
          onClick={handleButtonClick}
          isCoursePartOfCommunity={isCoursePartOfCommunity}
          isUserSubscriber={isUserSubscriber}
          style={{
            width: '100%',
            marginTop: 20,
            maxWidth: 428,
          }}
        />
      );
    return null;
  };

  return (
    <div>
      <CourseHeader
        course={course}
        onJoinCourse={onJoinCourse}
        onJoinCommunity={onJoinCommunity}
        isUserPurchasedCourse={isUserPurchasedCourse}
        isCoursePartOfCommunity={isCoursePartOfCommunity}
        isUserSubscriber={isUserSubscriber}
        onNext={onNext}
      />
      <div className={styles.courseInfoSection}>
        <CourseDetails
          course={course}
          community={community}
          courseCoach={courseCoach}
          onJoinCommunity={onJoinCommunity}
          onJoinCourse={onJoinCourse}
          isUserSubscriber={isUserSubscriber}
          isCoursePartOfCommunity={isCoursePartOfCommunity}
        />
        <div className={styles.coursePurchaseCardSection}>
          <EventOrCoursePaymentCard
            course={course}
            community={community}
            coach={courseCoach}
            onJoinSingleEventOrCourse={onJoinCourse}
            isUserAlreadyPurchased={isUserPurchasedCourse}
            isUserSubscriber={isUserSubscriber}
            isPartOfCommunity={isCoursePartOfCommunity}
            isExclusiveToCommunity={isExclusiveToCommunity}
            isFree={isFreeCourse}
            onNext={onNext}
            handleButtonClick={handleButtonClick}
            deeplink={deeplink}
            type={communityContants.COMMUNITY_FEATURE_TYPES.COURSE}
            eventOrCourseTitle={course.name}
            eventOrCoursePrice={course.price}
            eventOrCourseCommunityPrice={course.communityPrice}
            eventOrCourseCommunityMemberDiscount={getCommunityMemberCourseDiscount(
              course
            )}
            renderSubmitButton={renderJoinCommunityOrCourseButton}
          />
        </div>
      </div>
      <div className={styles.purchaseCourseSection}>
        <div className={styles.horizontalRow}></div>
        <EventOrCoursePurchaseOptionFooter
          course={course}
          community={community}
          coach={courseCoach}
          onJoinSingleEventOrCourse={onJoinCourse}
          isUserAlreadyPurchased={isUserPurchasedCourse}
          isUserSubscriber={isUserSubscriber}
          isPartOfCommunity={isCoursePartOfCommunity}
          isExclusiveToCommunity={isExclusiveToCommunity}
          isFree={isFreeCourse}
          onNext={onNext}
          handleButtonClick={handleButtonClick}
          deeplink={deeplink}
          type={communityContants.COMMUNITY_FEATURE_TYPES.COURSE}
          eventOrCourseTitle={course.name}
          eventOrCoursePrice={course.price}
          eventOrCourseCommunityPrice={course.communityPrice}
          eventOrCourseCommunityMemberDiscount={getCommunityMemberCourseDiscount(
            course
          )}
          renderSubmitButton={renderJoinCommunityOrCourseButton}
        />
      </div>
      {!isMobile && <NewFooter />}
      {showButton &&
        !isLoginModalVisible &&
        !isPaymentModalVisible &&
        !isUserPurchasedCourse && (
          <div
            className={classNames(
              'row align-center',
              styles.buttonContainer,
              styles.mobileOnly
            )}>
            <JoinCourseOrCommunityButton
              onClick={handleButtonClick}
              isCoursePartOfCommunity={isCoursePartOfCommunity}
              isUserSubscriber={isUserSubscriber}
              style={{
                width: '100%',
                maxWidth: 428,
              }}
            />
          </div>
        )}
    </div>
  );
}

export default CourseLandingPage;
