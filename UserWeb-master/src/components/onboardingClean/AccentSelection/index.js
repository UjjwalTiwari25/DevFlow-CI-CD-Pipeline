import React, { Fragment, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../app/Text';
import Header from '../Header';
import ACCENT_LIST from '../../../data/accentList.json';
import Analytics from '../../../services/Analytics';
import useBrowserHistory from '../../../hooks/browserHistory';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import useCountryDetails from '../../../hooks/countryDetails';

export default function AccentSelection({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('accentSelection', true, onBack, onNext);
  const { t } = useTranslations();
  const { isDark } = useShallowEqualSelector(({ theme }) => theme);
  const [accentList, setAccentList] = useState(Object.values(ACCENT_LIST));
  const [canSubmit, setCanSubmit] = useState(false);

  useEffect(() => {
    if (!profile.accentPreference) {
      const newAccentList = accentList.map((res) => {
        res.isActive = true;
        return res;
      });
      setAccentList(newAccentList);
    } else setAccentList(accentList);
  }, [profile]);

  useEffect(() => {
    const activePreference = accentList.filter((res) => {
      return res.isActive;
    });
    setCanSubmit(activePreference.length >= 1);
  }, [accentList]);

  const handleItemClick = (item) => {
    const newAccentList = accentList.map((res) => {
      if (res.key === item.key) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    setAccentList(newAccentList);
  };

  const onContinue = () => {
    let selectedAccentArr = [];
    accentList.forEach((item) => {
      if (item.isActive) {
        selectedAccentArr.push(item);
      }
    });
    selectedAccentArr = selectedAccentArr.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });

    const selectedAccentObj = {};
    selectedAccentArr.forEach((preference) => {
      if (preference.key) {
        selectedAccentObj[preference.key] = true;
      }
    });
    const accentListArr = Object.keys(selectedAccentObj);
    const accentCount = accentListArr.length;
    Analytics.track(`Accent Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Accent Preference List': accentListArr,
      'Accent Preference Count': accentCount,
    });
    Analytics.setPeopleProperties({
      'Accent Preference List': accentListArr,
      'Accent Preference Count': accentCount,
    });
    onNext({ accentPreference: selectedAccentObj });
  };
  return (
    <Fragment>
      <Header
        title={t('onboarding_coach_accent_coaches_from_around_the_world_exp')}
        experiments={experiments}
      />
      <div className="item-container">
        {accentList &&
          accentList.map((item) => {
            return (
              <AccentItem
                key={item.key}
                code={item.key}
                onPress={() => handleItemClick(item)}
                isActive={item.isActive}
                isDark={isDark}
                accent={t(item.accent)}
              />
            );
          })}
      </div>
      {canSubmit && (
        <OnboardingBigContinueButton
          title={t('onboarding_coach_accent_button_continue')}
          experiments={experiments}
          onClick={onContinue}
        />
      )}
      <style jsx>{styles}</style>
    </Fragment>
  );
}

function AccentItem(props) {
  const { onPress, isActive, isDark, code, accent } = props;
  const { countryDetails } = useCountryDetails(code);

  const textColor = useCallback(() => {
    if (isDark) {
      return 'g100';
    }
    return 'w100';
  }, [isDark]);

  return (
    <div
      data-testid="onboardingAccentSelection"
      className={classNames('clickable item', {
        'select-border-blue': isActive,
      })}
      style={{
        background: isActive ? '#CACACA' : '#FFFFFF',
      }}
      onClick={onPress}>
      {countryDetails && countryDetails.imageUrl && (
        <img src={countryDetails.imageUrl} alt="country" className="flag" />
      )}
      <Text type="h4" weight="semibold" color={textColor()} align="center">
        {accent}
      </Text>

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
      <style jsx>{itemStyle}</style>
    </div>
  );
}
