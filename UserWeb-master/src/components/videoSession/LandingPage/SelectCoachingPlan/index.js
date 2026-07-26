import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { convertToDollar } from '@/utils';
import { getAvailableCoachingSpots } from '@/models/coach';
import I18NFormatter from '@/services/I18NFormatter';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function SelectCoachingPlan({ allPackages, coach, onSelectPlan }) {
  const { t } = useTranslations();
  const [coachingPackages, setCoachingPackages] = useState([]);
  const [durationTabs, setDurationTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState();
  const [selectedDurationDetails, setSelectedDurationDetails] = useState([]);
  const [bestValueId, setBestValueId] = useState();

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
              duration: videoFeatureData.duration,
            },
          ];
        } else {
          tempCoachingPackages[videoFeatureData.duration] = [
            {
              ...item,
              price: convertToDollar(item.price),
              numberOfSessions: videoFeatureData.numberOfSessions,
              duration: videoFeatureData.duration,
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

      setCoachingPackages(tempCoachingPackages);
      setDurationTabs(durationList);
      setSelectedTab(durationList[0]);
    }
  }, [allPackages]);

  useEffect(() => {
    if (!selectedTab || !coachingPackages) return;
    const tempSelectedDurationDetails = coachingPackages[selectedTab];
    const tempPerSessionPrice =
      tempSelectedDurationDetails[0].price /
      tempSelectedDurationDetails[0].numberOfSessions;
    let minPerSessionPrice = tempPerSessionPrice;
    let maxPerSessionPrice = tempPerSessionPrice;
    let tempBestValueId = tempSelectedDurationDetails[0].id;

    tempSelectedDurationDetails.forEach((item) => {
      const perSessionPrice = item.price / item.numberOfSessions;
      if (perSessionPrice <= minPerSessionPrice) {
        minPerSessionPrice = perSessionPrice;
        tempBestValueId = item.id;
      } else if (perSessionPrice > maxPerSessionPrice) {
        maxPerSessionPrice = perSessionPrice;
      }
    });

    setBestValueId(tempBestValueId);
    setSelectedDurationDetails(
      tempSelectedDurationDetails.map((item) => {
        return {
          ...item,
          discount: maxPerSessionPrice - item.price / item.numberOfSessions,
        };
      })
    );
  }, [selectedTab, coachingPackages]);

  return (
    <div className={styles.selectPlanCard}>
      <div className={styles.selectPlanTitle}>
        {t('video_coaching_select_plan_title')}
      </div>
      <div className={styles.packageListContainer}>
        <div className={styles.durationTabWrapper}>
          {durationTabs.map((duration) => (
            <div
              key={duration}
              className={classNames('clickable', styles.durationTab, {
                [styles.durationTabSelected]: duration === selectedTab,
                [styles.singleDurationTab]: durationTabs.length === 1,
              })}
              onClick={() => {
                setSelectedTab(duration);
              }}>
              <div className={styles.tabText}>
                {t('video_coaching_select_plan_tab_session_duration', {
                  duration,
                })}
              </div>
              {selectedTab === duration && (
                <div className={styles.tabHighligther}></div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.planItemList}>
          {selectedDurationDetails.map((item) => (
            <div
              className={classNames('clickable', styles.planItem, {
                [styles.bestValuePlanItem]: item.id === bestValueId,
              })}
              key={item.id}
              onClick={() => {
                onSelectPlan(item);
              }}>
              <div className={styles.planItemLeft}>
                <div className={styles.planItemTitle}>
                  {t('video_coaching_plan_card_title', {
                    count: item.numberOfSessions,
                    duration: I18NFormatter.formatNumber(selectedTab),
                  })}
                </div>
                {item?.discount > 0 && (
                  <div className={styles.saveText}>
                    {t('video_coaching_plan_card_you_save', {
                      discount: I18NFormatter.formatCurrency(
                        parseInt(item.discount * item.numberOfSessions, 10),
                        {
                          maximumFractionDigits: 0,
                        }
                      ),
                    })}
                  </div>
                )}
                {item.id === bestValueId && (
                  <div className={styles.buttonWrapper}>
                    <div
                      className={classNames(
                        styles.buttonText,
                        styles.spotButton
                      )}>
                      {t('video_coaching_availability_card_badge_spot_left', {
                        spotCount: getAvailableCoachingSpots(coach),
                      })}
                    </div>
                    <div
                      className={classNames(
                        styles.buttonText,
                        styles.bestValueButton
                      )}>
                      {t('video_coaching_plan_badge_best_value')}
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.planPrice}>
                {t('video_coaching_plan_card_price', {
                  price: I18NFormatter.formatCurrency(item.price, {
                    maximumFractionDigits: 0,
                  }),
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SelectCoachingPlan;
