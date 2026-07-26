import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

export const SLEEP_HOURS_OPTIONS = [
  {
    title: `onboarding_sleep_hours_list_item_4_hours`,
    itemKey: `4hours`,
    score: -4,
  },
  {
    title: `onboarding_sleep_hours_list_item_5_hours`,
    itemKey: `5hours`,
    score: -3,
  },
  {
    title: `onboarding_sleep_hours_list_item_6_hours`,
    itemKey: `6hours`,
    score: -2,
  },
  {
    title: `onboarding_sleep_hours_list_item_7_hours`,
    itemKey: `7hours`,
    score: -1,
  },
  {
    title: `onboarding_sleep_hours_list_item_8_hours`,
    itemKey: `8hours`,
    score: 0,
  },
];

export default function HoursOfSleep({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('hoursOfSleep', true, onBack, onNext);
  const { t } = useTranslations();
  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Hours Of Sleep Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      hoursOfSleep: itemKey,
    });
    Analytics.setPeopleProperties({
      'Hours Of Sleep Key': itemKey,
    });

    onNext({
      onboardingSleepScore: {
        ...(profile.onboardingSleepScore || {}),
        hoursOfSleep: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_sleep_hours_how_much_sleep2')}
        subtitle={t('onboarding_sleep_hours_current_behavior')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {SLEEP_HOURS_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingHoursSleep"
            title={t(item.title)}
            key={item.itemKey}
            onClick={() => onSelectItem(item)}
          />
        ))}
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
