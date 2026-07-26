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
import { listMeditations } from '../../../models/meditation';
import useThemeListener from '../../../hooks/themeListener';

export default function ContentType({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('contentTypes', true, onBack, onNext);
  const { t } = useTranslations();
  const { isDark } = useThemeListener();
  const [contentTypes, setContentTypes] = useState([]);

  const [tracks, setTracks] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    const trackIds = [];
    async function getTracks() {
      const tracksNew = await listMeditations(trackIds);
      setTracks(tracksNew);
    }
    if (contentTypes) {
      contentTypes.forEach((item) => {
        if (item.trackId) {
          trackIds.push(item.trackId);
        }
      });
    }

    if (contentTypes && !tracks) {
      getTracks();
    }
  }, [contentTypes, tracks]);

  useEffect(() => {
    const allContentTypes = Object.values(CONTENT_TYPES);
    const energyHealingIndex = allContentTypes.findIndex(
      (contentType) => contentType.key === 'energyHealing'
    );
    if (energyHealingIndex !== -1) {
      const energyHealingItem = allContentTypes.splice(
        energyHealingIndex,
        1
      )[0];
      allContentTypes.unshift(energyHealingItem);
    }
    setContentTypes(allContentTypes);
  }, []);

  useEffect(() => {
    if (contentTypes) {
      const activePreference = contentTypes.filter((res) => {
        return res.isActive;
      });

      setCanSubmit(activePreference.length >= 1);
    }
  }, [contentTypes]);

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
    let selectedPreferenceArr = []; // This will be sorted and sent to Mixpanel
    contentTypes.forEach((item) => {
      if (item.isActive) {
        selectedPreferenceArr.push(item);
      }
    });
    // Sort it - We want to get the order of the selected items. The items tapped first will be 1, 2, 3 and so on
    // We know the order though setting [selectedTime] as [Date.now()] when a preference is selected
    // selectedPreferenceObj example {"morning": 3, "sleepAnxiety": 1, "stress": 2}
    selectedPreferenceArr = selectedPreferenceArr.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedPreferenceObj = {};
    selectedPreferenceArr.forEach((preference, index) => {
      if (preference.key) {
        selectedPreferenceObj[preference.key] = index + 1;
      }
    });
    const contentTypeList = Object.keys(selectedPreferenceObj);
    const contentType = contentTypeList.map((x) => {
      return { type: x, order: selectedPreferenceObj[x] };
    });
    const contentTypeCount = contentTypeList.length;
    Analytics.track(`Type Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Type Preference Order': contentType,
      'Type Preference List': contentTypeList,
      'Type Preference Count': contentTypeCount,
    });
    Analytics.setPeopleProperties({
      'Type Preference List': contentTypeList,
      'Type Preference Count': contentTypeCount,
    });

    onNext({ contentTypePreference: selectedPreferenceObj });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_content_types_what_type_of_content', {
          givenName: profile?.givenName,
        })}
        subtitle={t('onboarding_content_types_choose_as')}
        experiments={experiments}
      />
      <div className="item-container">
        {contentTypes &&
          contentTypes.map((item) => (
            <>
              <ContentTypeItem
                key={item.key}
                onboardingLabel={item.onboardingLabel}
                onboardingLabelValue={t(item.onboardingLabel)}
                title={t(item.title)}
                img={item.fullImage}
                onPress={() => handleItemClick(item)}
                isActive={item.isActive}
                isDark={isDark}
                experiments={experiments}
                contentTypeIcons={item.icon}
                uniqueKey={item.key}
              />
            </>
          ))}
      </div>
      <OnboardingBigContinueButton
        title={t('button_continue')}
        experiments={experiments}
        onClick={onContinue}
        disabled={!canSubmit}
      />
      <style jsx>{styles}</style>
    </Fragment>
  );
}

const ContentTypeItem = React.memo(
  function Item({
    onPress,
    title,
    img,
    isActive,
    isDark,
    contentTypeIcons,
    uniqueKey,
    onboardingLabel,
    onboardingLabelValue,
  }) {
    const multipleDesignOverlay = isActive
      ? 'rgba(0,0,0,0.7)'
      : 'rgba(0,0,0,0.2)';

    return (
      <div
        data-testid="onboardingContentType"
        className={classNames('clickable item', {
          'select-border-white': isActive,
        })}
        style={{
          backgroundImage: `linear-gradient(${multipleDesignOverlay}, ${multipleDesignOverlay}),
            url(${img})`,
        }}
        onClick={onPress}>
        <div className="content-icons-container" style={{ width: '65%' }}>
          {contentTypeIcons && (
            <img
              src={contentTypeIcons}
              className="content-icons"
              alt="content-icons"
            />
          )}
          <Text
            type="h4"
            weight="semibold"
            color={isDark ? 'b100' : 'w100'}
            align={'center'}
            style={{
              maxWidth: uniqueKey === 'therapy' ? '80%' : 'auto',
            }}>
            {title}
          </Text>
        </div>

        <div
          className={classNames('check-icon-box', {
            'select-background-blue': isActive,
            'unselect-background': !isActive,
          })}>
          {isActive && (
            <img
              src="/static/images/check-with-shadow-2.png"
              alt="aura"
              className="check"
            />
          )}
        </div>

        {onboardingLabel && (
          <div
            className={classNames('label-container label-conatiner-top-right', {
              'green-background':
                onboardingLabel === 'onboarding_badge_label_popular',
              'gray-background':
                onboardingLabel ===
                'onboarding_content_types_onboarding_label_recommended',
            })}>
            <Text
              type="body2"
              weight="semibold"
              color="b100"
              align="center"
              style={{
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                lineHeight: '14px',
                fontSize: '12px',
              }}>
              {onboardingLabelValue}
            </Text>
          </div>
        )}
        <style jsx>{itemStyle}</style>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.isActive === nextProps.isActive
);
