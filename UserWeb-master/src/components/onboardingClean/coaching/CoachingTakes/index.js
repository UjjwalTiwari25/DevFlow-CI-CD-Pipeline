import React, { Fragment, useState, useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import { GrClose } from 'react-icons/gr';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import useBrowserHistory from '../../../../hooks/browserHistory';
import COACHING_GOALS from '../../../../data/coachingGoals.json';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import Analytics from '../../../../services/Analytics';
import Header from '../../Header';

export default function CoachingTakes({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('coachingMotivation', true, onBack, onNext);
  const [topics, setTopics] = useState(Object.values(COACHING_GOALS));
  const [responseText, setResponseText] = useState(null);
  const [showResponseBox, setShowResponseBox] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    if (profile && profile.coachingMotivationPreference) {
      if (profile.coachingMotivationPreference.response) {
        setResponseText(profile.coachingMotivationPreference.response);
        setShowResponseBox(true);
      }
    }
  }, [profile]);
  useEffect(() => {
    if (topics) {
      const activePreference = topics.filter((res) => {
        return res.isActive;
      });
      const findOther = activePreference.find((res) => {
        return res.unique === 'other';
      });
      setCanSubmit(
        (activePreference.length >= 1 && !findOther) || responseText
      );
    }
  }, [responseText, topics]);

  const handleItemClick = (item) => {
    const newTopics = topics.map((res) => {
      if (res.unique === item.unique) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    const activeOthers = topics.find((res) => {
      return res.unique === 'other' && res.isActive;
    });
    if (activeOthers) {
      setShowResponseBox(true);
    } else {
      setShowResponseBox(false);
    }
    setTopics(newTopics);
  };

  const onContinue = () => {
    let selectedCoachingTakes = []; // This will be sorted and sent to Mixpanel
    topics.forEach((item) => {
      if (item.isActive && item.unique !== 'other') {
        selectedCoachingTakes.push(item);
      }
    });

    selectedCoachingTakes = selectedCoachingTakes.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedCoachingPreferencesObj = {};
    selectedCoachingTakes.forEach((coachingMotivation, index) => {
      if (coachingMotivation.unique) {
        selectedCoachingPreferencesObj[coachingMotivation.unique] = index + 1;
      }
    });
    const topicList = Object.keys(selectedCoachingPreferencesObj);
    const topicsOrder = topicList.map((x) => {
      return {
        coachingMotivation: x,
        order: selectedCoachingPreferencesObj[x],
      };
    });
    const topicsCount = topicList.length;
    Analytics.track(`Coaching Motivation Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Coaching Motivation Order': topicsOrder,
      'Coaching Motivation List': topicList,
      'Coaching  Motivation Count': topicsCount,
    });
    Analytics.setPeopleProperties({
      'Coaching Motivation List': topicList,
      'Coaching Motivation Count': topicsCount,
    });
    if (responseText) {
      onNext({
        coachingMotivationPreference: {
          ...selectedCoachingPreferencesObj,
          response: responseText,
        },
      });
    } else {
      onNext({
        coachingMotivationPreference: selectedCoachingPreferencesObj,
      });
    }
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_coaching_takes_header_what_you_hoping')}
        subtitle={t('onboarding_coaching_takes_subtitle_tell_your_coach')}
        experiments={experiments}
      />
      <div className="item-container">
        {profile &&
          topics &&
          topics.map((item) => (
            <MotivationItem
              key={item.unique}
              title={t(item.titleKey)}
              onPress={() => handleItemClick(item)}
              isActive={item.isActive}
              img={item.image}
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
                handleItemClick(topics[topics.length - 1]);
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

const MotivationItem = React.memo(function Item({
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
      data-testid="onboardingMotivationItem"
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
