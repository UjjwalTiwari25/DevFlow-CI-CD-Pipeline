import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import Analytics from '../../../services/Analytics';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles';

const AGE_RANGE_OPTIONS = [
  {
    title: 'onboarding_age_list_item_under_26',
    minAge: 0,
    maxAge: 25,
    group: 'a',
  },
  {
    title: 'onboarding_age_list_item_26_35',
    minAge: 26,
    maxAge: 35,
    group: 'b',
  },
  {
    title: 'onboarding_age_list_item_36_45',
    minAge: 36,
    maxAge: 45,
    group: 'c',
  },
  {
    title: 'onboarding_age_list_item_46_55',
    minAge: 46,
    maxAge: 55,
    group: 'd',
  },
  {
    title: 'onboarding_age_list_item_over_55',
    minAge: 56,
    maxAge: 120,
    group: 'e',
  },
];

export default function AgeRange({ onNext, onBack, experiments }) {
  useBrowserHistory('ageRange', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ minAge, maxAge, group }) => {
    Analytics.setSuperProperties({
      'Age Min': minAge,
      'Age Max': maxAge,
    });
    Analytics.setPeopleProperties({
      'Age Min': minAge,
      'Age Max': maxAge,
    });
    onNext({
      ageMin: minAge,
      ageMax: maxAge,
      ageGroup: group,
    });
  };

  const onSkip = () => {
    Analytics.track(`Age Range Skipped`);
    onSelectItem({ minAge: null, maxAge: null, group: null });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_age_how_old')}
        subtitle={t('onboarding_age_find_best_content')}
        experiments={experiments}
        onSkip={onSkip}
        isShowSkip
      />
      <div className="item-container">
        <div className="background" />
        {AGE_RANGE_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingAgeRange"
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
