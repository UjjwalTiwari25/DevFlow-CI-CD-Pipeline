import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Header from '../../Header';
import OnboardingOptionButton from '../../OnboardingOptionButton';
import styles from './styles';

const SLEEP_OPTIONS = [
  {
    title: 'onboarding_describe_sleep_list_item_good_title',
    key: `good`,
  },
  {
    title: 'onboarding_describe_sleep_list_item_okay_title',
    key: `okay`,
  },
  {
    title: 'onboarding_describe_sleep_list_item_bad_title',
    key: `bad`,
  },
  {
    title: 'onboarding_describe_sleep_list_item_varies_title',
    key: `varies`,
  },
];

export default function DescribeSleep({ onNext, onBack, experiments }) {
  useBrowserHistory('describeSleep', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ key }) => {
    onNext({
      describe2WeeksSleep: key,
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_describe_sleep_header_describe_your_sleep')}
        subtitle={t('onboarding_describe_sleep_subtitle_always_talk_to')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {SLEEP_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingSleepSelection"
            title={t(item.title)}
            key={item.title}
            onClick={() => onSelectItem(item)}
          />
        ))}
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
