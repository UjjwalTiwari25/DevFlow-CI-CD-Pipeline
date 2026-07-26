import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const SLEEP_HOURS_OPTIONS = [
  {
    title: `onboarding_sleep_delay_state_list_item_agree`,
    itemKey: `agree`,
    score: -1,
  },
  {
    title: `onboarding_sleep_delay_state_list_item_disagree`,
    itemKey: `disagree`,
    score: 0,
  },
];

export default function SleepDelayState({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('sleepDelayState', true, onBack, onNext);
  const { t } = useTranslations();
  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Sleep Delay State Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      sleepDelayState: itemKey,
    });
    Analytics.setPeopleProperties({
      'Sleep Delay State Key': itemKey,
    });

    onNext({
      onboardingSleepScore: {
        ...(profile.onboardingSleepScore || {}),
        sleepDelayState: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_sleep_delay_state_list_item_delay_bedtime')}
        subtitle={t(
          'onboarding_sleep_delay_state_list_item_do_you_agree_with_the_statement_above'
        )}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {SLEEP_HOURS_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingSleepDelayState"
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
