import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';
import CourseCard from '../CommunityCourse/CourseCard';
import EventCard from '../CommunityLiveEvent/EventCard';

function ExclusiveContent({ communityCourses, communityEvents, coach }) {
  const course = communityCourses[1] || {};
  const event = communityEvents[1] || {};

  const { t } = useTranslations();
  return (
    <div className={styles.includesCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardInfo}>
          <div className={styles.includeLabel}>
            {t('community_includes_exclusive_content_label')}
          </div>
          <div className={styles.includeDescription}>
            {t('community_includes_live_event_description')}
          </div>
        </div>
      </div>

      <div className={styles.eventCards}>
        <CourseCard course={course} className={styles.courseCard} />

        <EventCard
          event={event}
          coach={coach}
          eventCardWrapperStyle={styles.liveEventCard}
        />
      </div>
    </div>
  );
}

export default ExclusiveContent;
