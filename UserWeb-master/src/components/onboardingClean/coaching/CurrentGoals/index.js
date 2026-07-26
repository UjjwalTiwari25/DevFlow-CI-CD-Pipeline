import React, { Fragment, useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import { Trans } from 'react-i18next';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import useBrowserHistory from '../../../../hooks/browserHistory';
import GOALS from '../../../../data/coachingCurrentActivities.json';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import Analytics from '../../../../services/Analytics';
import AuraRingClean from '../../../app/AuraRingClean';

export default function CurrentGoals({ onNext, onBack, profile, experiments }) {
  useBrowserHistory('currentGoals', true, onBack, onNext);

  const [goals, setGoals] = useState(Object.values(GOALS));
  const [canSubmit, setCanSubmit] = useState(false);
  const [responseText, setResponseText] = useState(null);
  const [showResponseBox, setShowResponseBox] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    if (profile && profile.currentActivitiesPreference) {
      if (profile.currentActivitiesPreference.response) {
        setResponseText(profile.currentActivitiesPreference.response);
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
      if (item.isActive && item.unique !== 'other') {
        selectedGoals.push(item);
      }
    });

    selectedGoals = selectedGoals.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedCurrentGoalsObj = {};
    selectedGoals.forEach((goal, index) => {
      if (goal.unique) {
        selectedCurrentGoalsObj[goal.unique] = index + 1;
      }
    });
    const goalList = Object.keys(selectedCurrentGoalsObj);
    const goalsOrder = goalList.map((x) => {
      return { goal: x, order: selectedCurrentGoalsObj[x] };
    });
    const goalsCount = goalList.length;
    Analytics.track(`Current Activities`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Current Activities Order': goalsOrder,
      'Current Activities List': goalList,
      'Current Activities Count': goalsCount,
    });
    Analytics.setPeopleProperties({
      'Current Activities List': goalList,
      'Current Activities Count': goalsCount,
    });
    if (responseText) {
      onNext({
        currentActivitiesPreference: {
          ...selectedCurrentGoalsObj,
          response: responseText,
        },
      });
    } else {
      onNext({
        currentActivitiesPreference: selectedCurrentGoalsObj,
      });
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
          i18nKey="onboarding_current_goals_header_doing_for_goals"
          components={[
            <span
              key="currentGoalHeaderUnderline"
              className="underline"></span>,
          ]}
        />
      </Text>
      <Text
        type="body"
        color="b64"
        align="left"
        style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>
        {t('onboarding_current_goals_subtitle_help_your_coach')}
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
      data-testid="onboardingCurrentGoalItem"
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
