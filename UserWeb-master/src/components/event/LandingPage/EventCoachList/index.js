import React from 'react';
import useTranslations from '@/hooks/translations';
import EventCoachItem from '../EventCoachItem';
import styles from './styles.module.scss';

function EventCoachList({ eventCoaches }) {
  const { t } = useTranslations();
  return (
    <div className={styles.coachNameWrapper}>
      <div className={styles.hostedBy}>{t('event_coach_list_hosted_by')}</div>
      <div className={styles.coachList}>
        {eventCoaches.map((coach, index) => {
          if (coach?.status === 'approved') {
            return <EventCoachItem key={index} coachId={coach.coachId} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default EventCoachList;
