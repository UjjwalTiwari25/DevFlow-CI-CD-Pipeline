import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

const courseOfferings = [
  {
    title: 'course_offering_20_hours',
  },
  {
    title: 'course_offering_break_through_barrier',
  },
  {
    title: 'course_offering_self_improvement',
  },
];

function CourseCard({ course, className }) {
  const { t } = useTranslations();
  const {
    image = '/static/images/course-image.png',
    name = t('course_default_name'),
    learnings = courseOfferings,
  } = course || {};

  return (
    <div className={classNames(styles.courseInnerCard, className)}>
      <img src={image} alt="" className={styles.courseInnerCardImage} />
      <div className={styles.courseInnerCardTitle}>{name}</div>

      <div className={styles.courseOfferingListWrapper}>
        {learnings.slice(0, 3).map((offering, index) => (
          <div key={index} className={styles.courseOfferingList}>
            <div className={styles.customList}></div>
            <div className={styles.courseOffer}>{t(offering.title)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default CourseCard;
