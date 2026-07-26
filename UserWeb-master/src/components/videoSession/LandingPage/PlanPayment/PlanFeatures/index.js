import React from 'react';
import Image from 'next/image';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

const DATA = [
  {
    id: 1,
    title: 'video_coaching_plan_feature_video_call_per_month',
    icons: '/static/images/videoCoaching/planIcons/Video.png',
  },
  {
    id: 2,
    title: 'video_coaching_plan_feature_unlimted_acess',
    icons: '/static/images/videoCoaching/planIcons/Emotions.png',
  },
  {
    id: 3,
    title: 'video_coaching_plan_feature_custom_recommendation',
    icons: '/static/images/videoCoaching/planIcons/Infinity.png',
  },
  {
    id: 4,
    title: 'video_coaching_plan_feature_automated_insights',
    icons: '/static/images/videoCoaching/planIcons/Favorite.png',
  },
  {
    id: 5,
    title: 'video_coaching_plan_feature_automated_share_journal',
    icons: '/static/images/videoCoaching/planIcons/Journal.png',
  },
];

function PlanFeatures({ coach, selectedPlan }) {
  const { t } = useTranslations();
  const { duration, numberOfSessions } = selectedPlan;

  return (
    <div className={styles.planFeatureItemList}>
      {DATA.map((item) => (
        <div key={item.id} className={styles.planFeatureItem}>
          <Image src={item.icons} height={24} width={24} alt="" />
          <div className={styles.planFeatureItemText}>
            {t(item.title, {
              coachName: coach.name,
              count: numberOfSessions,
              duration,
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlanFeatures;
