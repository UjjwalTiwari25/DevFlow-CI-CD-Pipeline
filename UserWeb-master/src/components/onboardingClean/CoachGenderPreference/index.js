import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import Analytics from '../../../services/Analytics';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles';

const GENDER_PREFERENCE_OPTIONS = [
  {
    title: `onboarding_coach_gender_list_item_male`,
    option: 'male',
  },
  {
    title: `onboarding_coach_gender_list_item_female`,
    option: 'female',
  },
  {
    title: `onboarding_coach_gender_list_item_both`,
    option: 'both',
  },
];

export default function CoachGenderPreference({ onNext, onBack, experiments }) {
  useBrowserHistory('coachGenderPreference', true, onBack, onNext);
  const { t } = useTranslations();

  const onSelectItem = ({ title, option }) => {
    Analytics.track(`Coach Gender Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Coach Gender Preference Key': option,
      'Coach Gender Preference': title,
    });
    Analytics.setSuperProperties({
      'Coach Gender Preference': option,
    });
    Analytics.setPeopleProperties({
      'Coach Gender Preference': option,
    });
    onNext({
      coachGenderPreference: option,
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_coach_gender_gender_preference')}
        subtitle={t('onboarding_coach_gender_see_all_coaches')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {GENDER_PREFERENCE_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingCoachGender"
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
