import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const OPTIONS = [
  {
    title: 'onboarding_motivation_state_list_item_few_days_ago',
    itemKey: `fewDaysAgo`,
    score: -1,
  },
  {
    title: 'onboarding_motivation_state_list_item_less_than_a_year_ago',
    itemKey: `lessThanAYearAgo`,
    score: -2,
  },
  {
    title: 'onboarding_motivation_state_list_item_more_than_a_year_ago',
    itemKey: `moreThanAYearAgo`,
    score: -3,
  },
  {
    title: 'onboarding_motivation_state_list_item_never',
    itemKey: `never`,
    score: 0,
  },
];

export default function MotivationState({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('motivationState', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Motivation State Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Motivation State Key': itemKey,
    });
    Analytics.setPeopleProperties({
      'Motivation State Key': itemKey,
    });

    onNext({
      onboardingWellnessScore: {
        ...(profile.onboardingWellnessScore || {}),
        motivationState: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_motivation_state_header')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingMotivationState"
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
