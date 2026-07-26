import styles from './styles.module.scss';

function CoachInfo({ coach }) {
  return (
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
  );
}
export default CoachInfo;
