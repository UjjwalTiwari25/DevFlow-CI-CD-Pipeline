import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import styles from './styles.module.scss';

const STEP_LIST = [
  {
    stepNo: 1,
    title: 'video_coaching_how_it_work_step_one_title',
    description: 'video_coaching_how_it_work_step_one_description',
    image: '/static/images/videoCoaching/step-1.png',
  },
  {
    stepNo: 2,
    title: 'video_coaching_how_it_work_step_two_title',
    description: 'video_coaching_how_it_work_step_two_description',
    image: '/static/images/videoCoaching/step-2.png',
  },
  {
    stepNo: 3,
    title: 'video_coaching_how_it_work_step_three_title',
    description: 'video_coaching_how_it_work_step_three_description',
    image: '/static/images/videoCoaching/step-3.png',
  },
  {
    stepNo: 4,
    title: 'video_coaching_how_it_work_step_four_title',
    description: 'video_coaching_how_it_work_step_four_description',
    image: '/static/images/videoCoaching/step-4.png',
  },
];

function HowItWork() {
  const { t } = useTranslations();
  return (
    <div>
      <div className={styles.howItworkTitle}>
        {t('video_coaching_how_it_work_title')}
      </div>
      <div className={styles.howItWorkSteps}>
        {STEP_LIST.map((step) => (
          <div key={`item-${step.stepNo}`} className={styles.stepContainer}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNo}>
                {I18NFormatter.formatNumber(step.stepNo)}
              </div>
              <div className={styles.stepDetails}>
                <div className={styles.stepTitle}>{t(step.title)}</div>
                <div className={styles.stepDescription}>
                  {t(step.description)}
                </div>
              </div>
            </div>
            <img src={step.image} alt="" className={styles.howItWorkImage} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default HowItWork;
