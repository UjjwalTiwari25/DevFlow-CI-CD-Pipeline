import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function YourCoach({ coach, hideTitle }) {
  const { t } = useTranslations();
  return (
    <div className={styles.yourCoachWrapper}>
      {!hideTitle && (
        <div className={styles.yourCoachLabel}>{t('community_your_coach')}</div>
      )}
      <div className={styles.coachCommunityCard}>
        <div className={styles.coachInfoHeader}>
          <img
            className={styles.yourCoachProfileImage}
            src={coach.profilePicture}
            alt={coach.name}
          />
          <div>
            <div className={styles.yourCoachName}>{coach.name}</div>
            <div className={styles.yourCoachDesignation}>
              {coach.professionalTitle}
            </div>
          </div>
        </div>

        <div className={styles.yourCoachDescription}>{coach.bio}</div>
      </div>
    </div>
  );
}

export default YourCoach;
