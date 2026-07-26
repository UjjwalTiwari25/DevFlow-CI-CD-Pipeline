import React, { Fragment, useCallback } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../hooks/browserHistory';
import Analytics from '../../../services/Analytics';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles';
import Header from '../Header';

const QUESTIONS = [
  {
    title: `onboarding_explore_english_content_list_item_yes`,
    option: true,
  },
  {
    title: `onboarding_explore_english_content_list_item_no`,
    option: false,
  },
];

export default function ExploreEnglishContent({ onNext, onBack, experiments }) {
  useBrowserHistory('excludeEnglishLocale', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();

  const onSelectItem = ({ option }) => {
    const localePreferencesObj = {};
    localePreferencesObj[currentLocale] = 1;
    if (option) {
      localePreferencesObj.en = 2;
    }

    const localePreferenceList = Object.keys(localePreferencesObj);
    const localePreferences = localePreferenceList.map((x) => {
      return { type: x, order: localePreferencesObj[x] };
    });
    const localePreferenceCount = localePreferenceList.length;
    Analytics.track(`Locale Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Locale Preference Order': localePreferences,
      'Locale Preference List': localePreferenceList,
      'Locale Preference Count': localePreferenceCount,
    });
    Analytics.setSuperProperties({
      'Locale Preference List': localePreferenceList,
      'Locale Preference Count': localePreferenceCount,
    });
    Analytics.setPeopleProperties({
      'Locale Preferences List': localePreferenceList,
    });
    onNext({
      localePreferences: localePreferencesObj,
    });
  };
  const getLanguageName = useCallback(() => {
    if (currentLocale === 'de') return 'locale_de';
    if (currentLocale === 'ko') return 'locale_ko';
    if (currentLocale === 'ja') return 'locale_ja';
    if (currentLocale === 'es') return 'locale_es';
    if (currentLocale === 'fr') return 'locale_fr';
    return 'locale_pt_BR';
  }, [currentLocale]);

  return (
    <Fragment>
      <Header
        title={t('onboarding_explore_english_content_header')}
        subtitle={t('onboarding_explore_english_content_subtitle', {
          languageName: t(getLanguageName()).toLocaleLowerCase(),
        })}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        {QUESTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingEnglishContentQuestion"
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
