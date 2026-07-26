import { useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import styles from '../styles.module.scss';

function PlanSection({ allPackages }) {
  const { t } = useTranslations();
  const [planData, setPlanData] = useState();

  useEffect(() => {
    if (allPackages && allPackages.length > 0) {
      const tempCoachingPackages = {};
      allPackages.forEach((item) => {
        const videoFeatureData = item.features.find(
          (featureItem) => featureItem.feature === 'video'
        );

        if (tempCoachingPackages[videoFeatureData.duration]?.length > 0) {
          tempCoachingPackages[videoFeatureData.duration] = [
            ...tempCoachingPackages[videoFeatureData.duration],
            {
              ...item,
              price: convertToDollar(item.price),
              numberOfSessions: videoFeatureData.numberOfSessions,
            },
          ];
        } else {
          tempCoachingPackages[videoFeatureData.duration] = [
            {
              ...item,
              price: convertToDollar(item.price),
              numberOfSessions: videoFeatureData.numberOfSessions,
            },
          ];
        }
      });

      const durationList = Object.keys(tempCoachingPackages);

      durationList.forEach((item) => {
        tempCoachingPackages[item].sort((a, b) =>
          a.numberOfSessions > b.numberOfSessions ? 1 : -1
        );
      });

      const durationItemData = {};

      durationList.forEach((item) => {
        const firstPackageInfo = tempCoachingPackages[item][0];
        const currentDurationData = {
          minSessions: firstPackageInfo?.numberOfSessions,
          maxSessions: firstPackageInfo?.numberOfSessions,
          startPrice: firstPackageInfo?.price,
          duration: parseInt(item, 10),
        };

        tempCoachingPackages[item].forEach((packageItem) => {
          if (currentDurationData.minSessions > packageItem.numberOfSessions)
            currentDurationData.minSessions = packageItem.numberOfSessions;
          if (currentDurationData.maxSessions < packageItem.numberOfSessions)
            currentDurationData.maxSessions = packageItem.numberOfSessions;
          if (currentDurationData.startPrice > packageItem.startPrice)
            currentDurationData.startPrice = packageItem.startPrice;
        });
        durationItemData[item] = currentDurationData;
      });

      setPlanData(Object.values(durationItemData));
    }
  }, [allPackages]);

  const generatePlanTitle = (plan) => {
    if (!plan) return null;
    if (plan.duration === 30) {
      return t('video_coaching_plan_thirty_min_session', {
        minSessions: plan.minSessions,
        maxSessions: plan.maxSessions,
      });
    }
    if (plan.duration === 60) {
      return t('video_coaching_plan_one_hr_session', {
        minSessions: plan.minSessions,
        maxSessions: plan.maxSessions,
      });
    }
    return null;
  };

  return (
    planData &&
    planData.length > 0 && (
      <div className={styles.coachInfoWrapper}>
        <div className={styles.coachInfoListTitle}>
          {t('video_coaching_title_plans')}
        </div>

        <div className={styles.serviceList}>
          {planData.map((planItem) => (
            <div className={styles.serviceItemTitle} key={planItem.duration}>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="6"
                  height="7"
                  viewBox="0 0 6 7"
                  fill="none">
                  <circle cx="3" cy="3.35547" r="3" fill="#2F3237" />
                </svg>
              </div>
              <div>
                <div>{generatePlanTitle(planItem)}</div>

                <div className={styles.planStartingFrom}>
                  {t('video_coaching_plan_starting_form', {
                    amount: I18NFormatter.formatCurrency(planItem.startPrice),
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
export default PlanSection;
