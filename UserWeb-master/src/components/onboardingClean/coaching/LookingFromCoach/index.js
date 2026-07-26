import React, { Fragment, useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import useBrowserHistory from '../../../../hooks/browserHistory';
import LOOKING_FROM_COACH from '../../../../data/lookingFromCoach.json';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import Analytics from '../../../../services/Analytics';
import Header from '../../Header';

export default function LookingFromCoach({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('lookingFromCoach', true, onBack, onNext);
  const [seekingGoals, setSeekingGoals] = useState(
    Object.values(LOOKING_FROM_COACH)
  );
  const [canSubmit, setCanSubmit] = useState(false);
  const [responseText, setResponseText] = useState(null);
  const [showResponseBox, setShowResponseBox] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    if (profile && profile.coachingGoalsPreference) {
      if (profile.coachingGoalsPreference.response) {
        setResponseText(profile.coachingGoalsPreference.response);
        setShowResponseBox(true);
      }
    }
  }, [profile]);

  useEffect(() => {
    if (seekingGoals) {
      const ActiveSeekingGoals = seekingGoals.filter((res) => {
        return res.isActive;
      });
      const findOther = ActiveSeekingGoals.find((res) => {
        return res.unique === 'other';
      });
      setCanSubmit(
        (ActiveSeekingGoals.length >= 1 && !findOther) || responseText
      );
    }
  }, [responseText, seekingGoals]);

  const handleItemClick = (item) => {
    const newTopics = seekingGoals.map((res) => {
      if (res.unique === item.unique) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    const activeOthers = seekingGoals.find((res) => {
      return res.unique === 'other' && res.isActive;
    });
    if (activeOthers) {
      setShowResponseBox(true);
    } else {
      setShowResponseBox(false);
    }
    setSeekingGoals(newTopics);
  };

  const onContinue = () => {
    let selectedSeekingGoals = []; // This will be sorted and sent to Mixpanel
    seekingGoals.forEach((item) => {
      if (item.isActive) {
        selectedSeekingGoals.push(item);
      }
    });
    // Sort it - We want to get the order of the selected items. The items tapped first will be 1, 2, 3 and so on
    // We know the order though setting [selectedTime] as [Date.now()] when a motivation is selected
    // selectedMotivationObj example {"morning": 3, "sleepAnxiety": 1, "stress": 2}
    selectedSeekingGoals = selectedSeekingGoals.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedSeekingGoalsObj = {};
    selectedSeekingGoals.forEach((goals, index) => {
      if (goals.unique) {
        selectedSeekingGoalsObj[goals.unique] = index + 1;
      }
    });
    const topicList = Object.keys(selectedSeekingGoalsObj);
    const topicsOrder = topicList.map((x) => {
      return { goals: x, order: selectedSeekingGoalsObj[x] };
    });
    const topicsCount = topicList.length;
    Analytics.track(`Coaching Goals Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Coaching Goals Order': topicsOrder,
      'Coaching Goals List': topicList,
      'Coaching Goals Count': topicsCount,
    });
    Analytics.setPeopleProperties({
      'Coaching Goals List': topicList,
      'Coaching Goals Count': topicsCount,
    });
    if (responseText) {
      onNext({
        coachingGoalsPreference: {
          ...selectedSeekingGoalsObj,
          response: responseText,
        },
      });
    } else {
      onNext({
        coachingGoalsPreference: selectedSeekingGoalsObj,
      });
    }
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_looking_from_coach_header_looking_from_coach')}
        subtitle={t(
          'onboarding_looking_from_coach_subtitle_talk_to_your_coach'
        )}
        experiments={experiments}
      />
      <div className="item-container">
        {seekingGoals &&
          seekingGoals.map((item) => (
            <SeekingGoalsItem
              key={item.unique}
              title={t(item.title)}
              img={item.image}
              onPress={() => handleItemClick(item)}
              showResponseBox={showResponseBox}
              isActive={item.isActive}
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
                handleItemClick(seekingGoals[seekingGoals.length - 1]);
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

const SeekingGoalsItem = React.memo(function Item({
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
      data-testid="onboardingSeekingGoalItem"
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
