import React, { useState, useEffect, Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import Analytics from '../../../services/Analytics';
import { getRecommendationList } from '../../../models/user';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles';

const GENDER_OPTIONS = [
  {
    title: 'onboarding_gender_list_item_female',
    itemKey: `female`,
  },
  {
    title: 'onboarding_gender_list_item_male',
    itemKey: `male`,
  },
  {
    title: 'onboarding_gender_list_item_other_key',
    itemKey: `other`,
  },
  {
    title: 'onboarding_gender_list_item_non_binary',
    itemKey: `nonBinary`,
  },
  {
    title: 'onboarding_gender_list_item_transgendered',
    itemKey: `transgendered`,
  },
];

export default function Gender({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('gender', true, onBack, onNext);
  const [genders, setGenders] = useState([]);
  const { t } = useTranslations();

  useEffect(() => {
    const getGenders = async () => {
      const response = await getRecommendationList('gender', profile);
      if (response) {
        const fetchedList = [];
        response.forEach((item) => {
          const configItem = GENDER_OPTIONS.find(
            (option) => option.itemKey === item.id
          );
          if (configItem) {
            fetchedList.push(configItem);
          }
        });
        setGenders(fetchedList);
      } else {
        setGenders(GENDER_OPTIONS);
      }
    };

    getGenders();
  }, []);

  const onSelectItem = ({ itemKey }) => {
    Analytics.setPeopleProperties({
      Gender: itemKey,
    });
    Analytics.setSuperProperties({
      Gender: itemKey,
    });
    onNext({
      gender: itemKey,
    });
  };

  const onSkip = () => {
    Analytics.track(`Skip Gender`);
    onNext({ gender: null });
  };

  return (
    <Fragment>
      <Header
        title={
          experiments.ageQuestionShortLandingPage === 'a' ||
          experiments.ageQuestionShortLandingPage === 'c'
            ? t('onboarding_gender_your_gender_exp')
            : t('onboarding_gender_your_gender')
        }
        subtitle={t('onboarding_gender_collect_this_info')}
        experiments={experiments}
        isShowSkip={true}
        onSkip={onSkip}
      />
      <div className="item-container">
        <div className="background" />
        {genders.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingGenderSelection"
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
