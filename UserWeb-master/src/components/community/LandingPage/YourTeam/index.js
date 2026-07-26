import React from 'react';
import YourCoach from '@/components/app/YourCoach';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function YourTeam({ community, communityCoaches }) {
  const { t } = useTranslations();
  const { team } = community || {};

  return (
    <div className={styles.yourTeamSection}>
      <div className={styles.yourTeamText}>
        {t(
          team && team?.length > 0
            ? 'community_your_team_label'
            : 'community_your_coach_label'
        )}
      </div>
      {team && team?.length > 0 ? (
        <div className={styles.yourTeamMembersCards}>
          {team.map((member) => (
            <div key={member.name} className={styles.memberCard}>
              <div className={styles.memberCardHeader}>
                <img
                  src={member.picture}
                  alt={member.name}
                  className={styles.memberProfile}
                />
                <div className={styles.coachInfoWrapper}>
                  <div className={styles.memberName}>{member?.name}</div>
                  <div className={styles.memberProfessionalTitle}>
                    {member?.professionalTitle}
                  </div>
                </div>
              </div>
              <div className={styles.experianceList}>
                {member?.experience?.map((experience, index) => (
                  <div
                    key={`exp-${index}`}
                    className={styles.experianceListItem}>
                    <div className={styles.bullet}></div>
                    <div>{experience}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`${styles.yourTeamCards} ${communityCoaches.length === 1 ? styles.singleCoach : ''}`}>
          {communityCoaches?.map((coach, index) => (
            <YourCoach key={`coach-${index}`} coach={coach} hideTitle />
          ))}
        </div>
      )}
    </div>
  );
}

export default YourTeam;
