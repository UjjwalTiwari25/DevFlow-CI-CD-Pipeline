import React, { useState } from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../app/Text';
import useInterval from '../../../hooks/interval';
import useTimeout from '../../../hooks/timeout';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';

const LOADING_ITEMS = [
  'onboarding_loader_widget_list_item_goals',
  'onboarding_loader_widget_list_item_your_interests',
  'onboarding_loader_widget_list_item_your_age',
  'onboarding_loader_widget_list_item_your_gender',
];

export default function LoaderWidget({ onNext }) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  const [loadingPercentage, setLoadingPercentage] = useState(0);
  useInterval(
    () => {
      setLoadingPercentage(loadingPercentage + 1);
    },
    loadingPercentage === 100 ? null : 100
  );
  useTimeout(onNext, 12500);

  const currentItem = LOADING_ITEMS[Math.floor(loadingPercentage / 25)];
  return (
    <div className="loader-widget-container">
      <div id="ring-loader">
        <Text type="h4" align="center" color="b100" weight="regular">
          {`${loadingPercentage}%`}
        </Text>
      </div>
      {loadingPercentage >= 100 ? (
        <Text type="h4" align="center" color="b100" weight="regular">
          {t('onboarding_loader_widget_plan_is_ready')}
        </Text>
      ) : (
        <>
          <Text
            type="h3"
            component="h1"
            align="center"
            color="b100"
            weight="regular"
            style={{ maxWidth: 310 }}>
            {t('onboarding_loader_widget_personlizing_your_plan')}
          </Text>
          <div id="plan-item-text" className="animation1">
            {LOADING_ITEMS.map((item, index) => {
              return (
                <div
                  className={
                    currentItem === item
                      ? 'loading-item-active box-shadow'
                      : 'loading-item-inactive box-shadow'
                  }
                  key={index}>
                  {isDark ? (
                    <Text
                      type="body"
                      align="center"
                      color={`${currentItem === item ? 'w100' : 'w64'}`}>
                      {t(LOADING_ITEMS[index])}
                    </Text>
                  ) : (
                    <Text
                      type="body"
                      align="center"
                      color={`${currentItem === item ? 'b100' : 'b64'}`}>
                      {t(LOADING_ITEMS[index])}
                    </Text>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
