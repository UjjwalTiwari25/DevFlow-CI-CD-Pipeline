import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useTranslations from '@/hooks/translations';
import Accordion from '@/components/app/Accordian';
import YourCoach from '@/components/app/YourCoach';
import Analytics from '@/services/Analytics';
import YourCommunity from '@/components/app/YourCommunity';
import VideoPlayer from '@/components/app/VideoPlayer';
import styles from './styles.module.scss';

function CourseDetails({ course, community, courseCoach }) {
  const [, isMobile] = useResponsiveWindow();
  const { t } = useTranslations();
  const handleCourseOverviewEventTracking = ({ title, action } = {}) => {
    Analytics.track('Course Button Tapped', {
      Screen: 'Course Details',
      'Page Type': 'Course and Community',
      'Course Name': course?.name,
      'Course ID': course?.id,
      Button: 'Course Overview',
      'Course Overview': title,
      Tab: 'Overview',
      Action: action,
      'Coach Name': courseCoach?.name,
      'Coach ID': courseCoach?.id,
    });
  };

  return (
    <div className={styles.courseInfoDetails}>
      <div>
        <div className={styles.courseTaughtBy}>{t('course_taught_by')}</div>
        <div className={styles.courseCoachInfo}>
          <div>
            <Image
              src={courseCoach.profilePicture}
              alt=""
              height={isMobile ? 46 : 58}
              width={isMobile ? 46 : 58}
              style={{ borderRadius: 60, objectFit: 'cover' }}
            />
          </div>
          <div>
            <div className={styles.courseCoachName}>{courseCoach.name}</div>
            <div className={styles.courseCoachProfession}>
              {courseCoach.professionalTitle}
            </div>
          </div>
        </div>
        <hr className={styles.divider} />
        {course.video && (
          <div className={styles.coursePreviewVideo}>
            <VideoPlayer
              videoSrc={course.video}
              hideDuration
              style={{ borderRadius: 16 }}
              enableModal={true}
              fallBackThumbnail={course.image}
              showOverlay
            />
          </div>
        )}
        <div className={styles.courseTitle}>{course.title}</div>
        <div className={styles.courseDescription}>{course.description}</div>
      </div>
      {course.benefits && (
        <div className={styles.benefitsSection}>
          <div className={styles.benefitsSectionTitle}>
            {t('course_designed_for_you')}
          </div>
          <div className={styles.benefitsListWrapper}>
            {course.benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitCount}>{index + 1}</div>
                <div>
                  <div className={styles.benefitTitle}>{benefit.title}</div>
                  <div className={styles.benefitText}>
                    {benefit.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {course.learnings && (
        <div className={styles.learningsSection}>
          <div className={styles.learningsSectionTitle}>
            {t('course_learnings_you_will_discover')}
          </div>
          <div className={styles.learningListSection}>
            {course.learnings.map((learning, index) => (
              <div key={index} className={styles.learningList}>
                <div className={styles.learningCount}>{index + 1}</div>
                <div>
                  <div className={styles.learningTitle}>{learning.title}</div>
                  <div className={styles.learningText}>
                    {learning.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className={styles.courseOverviewText}>{t('course_overview')}</div>
        <Accordion
          sections={course.sections}
          onOpenClose={({ action, title } = {}) => {
            handleCourseOverviewEventTracking({ action, title });
          }}
        />
      </div>

      <YourCoach coach={courseCoach} />

      {community && <YourCommunity community={community} />}
    </div>
  );
}
export default CourseDetails;
