import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const OPTIONS = [
  {
    title: 'onboarding_anxiety_level_list_item_always',
    itemKey: `allTime`,
    score: -4,
  },
  {
    title: 'onboarding_anxiety_level_list_item_mostly',
    itemKey: `mostTime`,
    score: -3,
  },
  {
    title: 'onboarding_anxiety_level_list_item_sometimes',
    itemKey: `someTime`,
    score: -2,
  },
  {
    title: 'onboarding_anxiety_level_list_item_a_little',
    itemKey: `littleTime`,
    score: -1,
  },
  {
    title: 'onboarding_anxiety_level_list_item_never',
    itemKey: `noneTime`,
    score: 0,
  },
];

export default function AnxiousState({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('anxiousState', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Anxious State Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Anxious State Key': itemKey,
    });
    Analytics.setPeopleProperties({
      'Anxious State Key': itemKey,
    });

    onNext({
      onboardingWellnessScore: {
        ...(profile.onboardingWellnessScore || {}),
        anxiousState: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_anxiety_level_anxious_nervous')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingAnxiousFeel"
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
