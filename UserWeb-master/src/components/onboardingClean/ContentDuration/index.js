import React, { Fragment, useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../Header';
import Analytics from '../../../services/Analytics';
import useBrowserHistory from '../../../hooks/browserHistory';
import CONTENT_DURATION_OPTIONS from '../../../data/contentDurationOptions.json';
import styles from './styles';
import OnboardingOptionButton from '../OnboardingOptionButton';
import { getRecommendationList } from '../../../models/user';

export default function ContentDuration({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('contentDuration', true, onBack, onNext);
  const { t } = useTranslations();
  const [newContantDuration, setNewContentDuration] = useState([]);

  useEffect(() => {
    const getDurations = async () => {
      const response = await getRecommendationList('duration', profile);
      if (response) {
        const fetchedList = [];
        response.forEach((item) => {
          const configItem = CONTENT_DURATION_OPTIONS.find(
            (durationItem) => durationItem.itemKey === item.id
          );
          if (configItem) {
            fetchedList.push(configItem);
          }
        });
        setNewContentDuration(fetchedList);
      } else {
        setNewContentDuration(CONTENT_DURATION_OPTIONS);
      }
    };

    getDurations();
  }, []);

  const onSelectItem = ({ itemKey }) => {
    Analytics.track(`Duration Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Duration Category': itemKey,
    });
    Analytics.setPeopleProperties({
      'Duration Onboard Preference': itemKey,
    });
    onNext({ durationPreference: itemKey });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_content_length_what_content_length')}
        subtitle={t('onboarding_content_length_access_to_all_lengths')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {newContantDuration.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingTrackDuration"
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
