import React from 'react';
import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import { isCourseFree, joinCourse } from '@/models/course';
import styles from './styles.module.scss';
import JoinCourseOrCommunityButton from '../JoinCourseOrCommunityButton';

function CourseHeader({
  course,
  onJoinCourse,
  onJoinCommunity,
  isUserPurchasedCourse,
  isCoursePartOfCommunity,
  isUserSubscriber,
  onNext,
}) {
  const [, isMobile] = useResponsiveWindow();

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

  return (
    <div className={styles.contentContainer}>
      <div className={styles.courseInfoHeader}>
        <div className={styles.courseName}>{course.name}</div>
        <div className={styles.courseSummary}>{course.summary}</div>
        <div className={styles.ctaButton}>
          {!(
            isUserPurchasedCourse &&
            (isUserSubscriber || !isCoursePartOfCommunity)
          ) && (
            <JoinCourseOrCommunityButton
              onClick={handleButtonClick}
              isCoursePartOfCommunity={isCoursePartOfCommunity}
              isUserSubscriber={isUserSubscriber}
              style={{
                width: isMobile ? '100%' : '270px',
              }}
            />
          )}
        </div>
      </div>
      <div className={styles.coursePreviewImageWrapper}>
        <Image
          className={styles.coursePreviewImage}
          src={course.image}
          alt=""
          height={isMobile ? 242 : 337}
          width={isMobile ? 335 : 507}
        />
      </div>
    </div>
  );
}

export default CourseHeader;
