import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';
import CourseCard from './CourseCard';

function CommunityCourse({ communityCourses, coach }) {
  const { t } = useTranslations();
  const course = communityCourses[0] || {};

  return (
    <div className={styles.includesCard}>
      <div className={styles.cardHeader}>
        <div className={styles.includeLabel}>{t('community_course_label')}</div>

        <div className={styles.includeDescription}>
          {t('community_course_description')}
        </div>
      </div>
      <div className={styles.cardBody}>
        <CourseCard course={course} />
        <div>
          <img
            src={coach.profilePicture}
            alt="course coach"
            className={styles.courseInnerCardCoachImage}
          />
          <img
            src="/static/images/community/community-course-mobile-frame.png"
            alt="course coach"
            className={styles.courseInnerCardCoachImage}
          />
        </div>
      </div>
    </div>
  );
}

export default CommunityCourse;
