import React, { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../app/Text';
import Header from '../Header';
import CONTENT_TYPES from '../../../data/onboardingContentTypes.json';
import Analytics from '../../../services/Analytics';
import useBrowserHistory from '../../../hooks/browserHistory';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import useThemeListener from '../../../hooks/themeListener';
import { getRecommendationList } from '../../../models/user';

const notExcludingContentTypes = [
  'hypnosis',
  'soundscape',
  'lifeCoaching',
  'music',
  'story',
  'therapy',
];

export default function ExcludeContentTypes({
  onNext,
  onBack,
  profile,
  experiments,
  isCoachingOnboarding,
}) {
  useBrowserHistory('ExcludeContentTypes', true, onBack, onNext);
  const { t } = useTranslations();
  const { isDark } = useThemeListener();
  const [contentTypes, setContentTypes] = useState([]);

  if (!isCoachingOnboarding) {
    if (!notExcludingContentTypes.includes('energyHealing')) {
      notExcludingContentTypes.push('energyHealing');
    }
  }

  useEffect(() => {
    const handleContentTypes = async () => {
      let allContentTypes;
      const response = await getRecommendationList('type', profile);
      if (response) {
        const fetchedTypes = [];
        response.forEach((item) => {
          const configItem = CONTENT_TYPES[item.id];
          if (configItem) {
            fetchedTypes.push(configItem);
          }
        });
        allContentTypes = fetchedTypes;
      } else allContentTypes = Object.values(CONTENT_TYPES);
      let filteredContentTypes = allContentTypes.filter(
        (type) => !Object.keys(profile.contentTypePreference).includes(type.key)
      );

      filteredContentTypes = filteredContentTypes.filter((type) => {
        return type.key !== 'mindfulness';
      });

      filteredContentTypes = filteredContentTypes.filter((type) => {
        return !notExcludingContentTypes.includes(type.key);
      });

      setContentTypes(filteredContentTypes);
      if (filteredContentTypes?.length === 0) {
        onNext();
      }
    };
    if (profile.contentTypePreference) {
      handleContentTypes();
    }
  }, [profile]);

  const handleItemClick = (item) => {
    const newContentTypes = contentTypes.map((res) => {
      if (res.key === item.key) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    setContentTypes(newContentTypes);
  };

  const onContinue = () => {
    let excludedPreferenceArr = []; // This will be sorted and sent to Mixpanel
    contentTypes.forEach((item) => {
      if (item.isActive) {
        excludedPreferenceArr.push(item);
      }
    });
    // Sort it - We want to get the order of the selected items. The items tapped first will be 1, 2, 3 and so on
    // We know the order though setting [selectedTime] as [Date.now()] when a preference is selected
    // selectedExcludedPreferenceObj example {"morning": 3, "sleepAnxiety": 1, "stress": 2}
    excludedPreferenceArr = excludedPreferenceArr.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedExcludedPreferenceObj = {};
    excludedPreferenceArr.forEach((preference, index) => {
      if (preference.key) {
        selectedExcludedPreferenceObj[preference.key] = index + 1;
      }
    });
    const excludedContentTypeList = Object.keys(selectedExcludedPreferenceObj);
    const excludedContentType = excludedContentTypeList.map((x) => {
      return { type: x, order: selectedExcludedPreferenceObj[x] };
    });
    const excludedContentTypeCount = excludedContentTypeList.length;
    Analytics.track(`Excluded Content Type Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Excluded Content Type Preference Order': excludedContentType,
      'Excluded Content Type Preference List': excludedContentTypeList,
      'Excluded Content Type Preference Count': excludedContentTypeCount,
    });
    Analytics.setPeopleProperties({
      'Excluded Content Type Preference List': excludedContentTypeList,
      'Excluded Content Type Preference Count': excludedContentTypeCount,
    });
    return onNext({
      excludedContentTypePreference: selectedExcludedPreferenceObj,
    });
  };

  const onSkip = () => {
    Analytics.track(`Skip Excluded Content Type Preference`);
    onNext();
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_exclude_content_exclude_content')}
        subtitle={t('onboarding_exclude_content_change_in_app')}
        experiments={experiments}
      />
      <div className="item-container">
        {contentTypes &&
          contentTypes.map((item) => (
            <>
              <ContentTypeItem
                key={item.key}
                title={t(item.title)}
                img={item.fullImage}
                onPress={() => handleItemClick(item)}
                isActive={item.isActive}
                isDark={isDark}
              />
            </>
          ))}
      </div>
      <div className="skip-button-center">
        <OnboardingBigContinueButton
          style={{
            alignSelf: 'center',
            position: 'relative',
            bottom: '20px',
          }}
          title={t('button_continue')}
          experiments={experiments}
          onClick={onContinue}
        />
        <div onClick={onSkip} className="clickable">
          <Text
            type="h4"
            color="b100"
            weight="semibold"
            style={{
              lineHeight: '22px',
            }}>
            {t('button_skip')}
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}

const ContentTypeItem = React.memo(
  function Item({ onPress, title, img, isActive, isDark }) {
    const multipleDesignOverlay = isActive
      ? 'rgba(0,0,0,0.7)'
      : 'rgba(0,0,0,0.2)';
    return (
      <div
        data-testid="onboardingTypeExclude"
        className={classNames('clickable item', {
          'select-border-white': isActive,
        })}
        style={{
          backgroundImage: `linear-gradient(${multipleDesignOverlay}, ${multipleDesignOverlay}),
            url(${img})`,
        }}
        onClick={onPress}>
        <Text
          type="h4"
          weight="semibold"
          color={isDark ? 'b100' : 'w100'}
          align="center"
          style={{ width: '70%' }}>
          {title}
        </Text>
        <div
          className={classNames('check-icon-box', {
            'select-background': isActive,
            'unselect-background': !isActive,
          })}>
          {isActive && (
            <img
              src="/static/images/exclude.png"
              alt="aura"
              className="check"
            />
          )}
        </div>
        <style jsx>{itemStyle}</style>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.isActive === nextProps.isActive
);
