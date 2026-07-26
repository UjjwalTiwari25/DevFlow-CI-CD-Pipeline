import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const FALL_ASLEEP_OPTIONS = [
  {
    title: `onboarding_falling_asleep_list_item_less_than_10_minutes`,
    itemKey: `lessThan10`,
    score: -1,
  },
  {
    title: `onboarding_falling_asleep_list_item_10_to_20_minutes`,
    itemKey: `10-20`,
    score: 0,
  },
  {
    title: `onboarding_falling_asleep_list_item_20_to_30_minutes`,
    itemKey: `20-30`,
    score: -2,
  },
  {
    title: `onboarding_falling_asleep_list_item_more_than_30_minutes`,
    itemKey: `moreThan30`,
    score: -3,
  },
];

export default function FallAsleepTime({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('fallAsleepTime', true, onBack, onNext);
  const { t } = useTranslations();
  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Fall Asleep Time Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      fallAsleepTime: itemKey,
    });
    Analytics.setPeopleProperties({
      'Fall Asleep Time Key': itemKey,
    });

    onNext({
      onboardingSleepScore: {
        ...(profile.onboardingSleepScore || {}),
        fallAsleepTime: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_falling_asleep_how_long_to_fall_asleep')}
        subtitle={t('onboarding_falling_asleep_understand_your_behavior')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {FALL_ASLEEP_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingFallAsleep"
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
