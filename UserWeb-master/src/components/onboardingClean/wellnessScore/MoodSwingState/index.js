import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const OPTIONS = [
  {
    title: 'onboarding_mood_swing_state_list_item_often',
    itemKey: `often`,
    score: -3,
  },
  {
    title: 'onboarding_mood_swing_state_list_item_sometimes',
    itemKey: `someTime`,
    score: -2,
  },
  {
    title: 'onboarding_mood_swing_state_list_item_rarely',
    itemKey: `rarely`,
    score: -1,
  },
  {
    title: 'onboarding_mood_swing_state_list_item_never',
    itemKey: `never`,
    score: 0,
  },
];

export default function MoodSwingState({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('moodSwingState', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Mood Swing State Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Mood Swing State Key': itemKey,
    });
    Analytics.setPeopleProperties({
      'Mood Swing State Key': itemKey,
    });

    onNext({
      onboardingWellnessScore: {
        ...(profile.onboardingWellnessScore || {}),
        moodSwingState: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_mood_swing_state_header')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingMoodSwingState"
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
