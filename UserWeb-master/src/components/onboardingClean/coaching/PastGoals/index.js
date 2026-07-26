import React, { Fragment, useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import useBrowserHistory from '../../../../hooks/browserHistory';
import COACHING_PAST_ACTIVITIES from '../../../../data/coachingPastActivities.json';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import Analytics from '../../../../services/Analytics';
import AuraRingClean from '../../../app/AuraRingClean';

export default function PastGoals({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('pastGoals', true, onBack, onNext);

  const [goals, setGoals] = useState(Object.values(COACHING_PAST_ACTIVITIES));
  const [responseText, setResponseText] = useState(null);
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    if (profile && profile.pastActivitiesPreferences) {
      if (profile.pastActivitiesPreferences.response) {
        setResponseText(profile.pastActivitiesPreferences.response);
        setShowResponseBox(true);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (goals) {
      const activePreference = goals.filter((res) => {
        return res.isActive;
      });
      const findOther = activePreference.find((res) => {
        return res.unique === 'other';
      });
      setCanSubmit(
        (activePreference.length >= 1 && !findOther) || responseText
      );
    }
  }, [goals, responseText]);

  const handleItemClick = (item) => {
    const newGoals = goals.map((res) => {
      if (res.unique === item.unique) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    const activeOthers = goals.find((res) => {
      return res.unique === 'other' && res.isActive;
    });
    if (activeOthers) {
      setShowResponseBox(true);
    } else {
      setShowResponseBox(false);
    }
    setGoals(newGoals);
  };

  const onContinue = () => {
    let selectedGoals = []; // This will be sorted and sent to Mixpanel
    goals.forEach((item) => {
      if (item.isActive) {
        selectedGoals.push(item);
      }
    });

    selectedGoals = selectedGoals.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedPastGoalsObj = {};
    selectedGoals.forEach((item, index) => {
      if (item.unique && item.unique !== 'other') {
        selectedPastGoalsObj[item.unique] = index + 1;
      }
    });
    const goalList = Object.keys(selectedPastGoalsObj);
    const goalsOrder = goalList.map((x) => {
      return { item: x, order: selectedPastGoalsObj[x] };
    });
    const goalsCount = goalList.length;
    Analytics.track(`Past Activities`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Past Activities Order': goalsOrder,
      'Past Activities List': goalList,
      'Past Activities Count': goalsCount,
    });
    Analytics.setPeopleProperties({
      'Past Activities List': goalList,
      'Past Activities Count': goalsCount,
    });
    if (responseText) {
      onNext({
        pastActivitiesPreferences: {
          ...selectedPastGoalsObj,
          response: responseText,
        },
      });
    } else {
      onNext({ pastActivitiesPreferences: selectedPastGoalsObj });
    }
  };

  return (
    <Fragment>
      <AuraRingClean style={{ marginTop: 4, marginLeft: -14 }} />
      <Text
        type={'h3'}
        color="b100"
        component="h1"
        weight="regular"
        align="left"
        style={{ marginTop: 12 }}>
        <Trans
          ns="signup"
          i18nKey="onboarding_past_goals_header_what_you_done"
          components={[
            <span key="pastGoalsHeaderUnderline" className="underline"></span>,
          ]}
        />
      </Text>
      <Text
        type="body"
        color="b64"
        align="left"
        style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {t('onboarding_past_goals_subtitle_will_help_you')}
      </Text>
      <div className="item-container">
        {goals &&
          goals.map((item) => (
            <GoalsItem
              key={item.unique}
              title={t(item.title)}
              img={item.image}
              onPress={() => handleItemClick(item)}
              isActive={item.isActive}
              showResponseBox={showResponseBox}
            />
          ))}
        {showResponseBox && (
          <div className="text-area-container">
            <textarea
              type="textarea"
              className="text-area"
              rows={6}
              value={responseText || ''}
              placeholder={t('placeholder_add_your_response')}
              onChange={(e) => {
                setResponseText(e.target.value);
              }}
            />
            <div
              className="close-button"
              onClick={() => {
                handleItemClick(goals[goals.length - 1]);
                setResponseText(null);
              }}>
              <GrClose />
            </div>
          </div>
        )}
      </div>
      {canSubmit && (
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={onContinue}
        />
      )}
      <style jsx>{styles}</style>
    </Fragment>
  );
}

const GoalsItem = React.memo(function Item({
  onPress,
  title,
  img,
  isActive,
  showResponseBox,
}) {
  const overlayColor = isActive ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.45)';
  if (title === 'Other' && showResponseBox) {
    return null;
  }
  return (
    <div
      className={`item clickable`}
      data-testid="onboardingGoalItem"
      style={{
        backgroundColor:
          title === 'Other' && !isActive ? '#fff' : 'rgba(0,0,0,0.45)',
        backgroundImage:
          title !== 'Other' &&
          `linear-gradient(${overlayColor}, ${overlayColor}), url(${img})`,
      }}
      onClick={onPress}>
      <Text
        type="h4"
        weight="semibold"
        color={`${title === 'Other' && !isActive ? 'b100' : 'w100'}`}
        align="center"
        style={{ width: '80%' }}>
        {title}
      </Text>
      {isActive && (
        <div className="check-mark">
          <MdCheck />
        </div>
      )}
      <style jsx>{itemStyle}</style>
    </div>
  );
});
