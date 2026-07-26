import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { MdCheck } from 'react-icons/md';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import { getRecommendationList } from '@/models/user';
import Text from '../../app/Text';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import RECOMMENDATION_TOPICS from '../../../data/topics.json';
import Analytics from '../../../services/Analytics';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import styles, { itemStyle } from './styles';
import useThemeListener from '../../../hooks/themeListener';

const extraTopic = {
  unique: 'peacefulMoments',
  isActive: false,
  img: {
    uri: '/static/images/dion.jpg',
  },
  motivation: 'onboarding_motivation_plan_list_item_peaceful_moments',
};
export default function WebOnboardingMotivationPlan({
  onNext,
  onBack,
  profile,
  experiments,
  isCoachingOnboarding,
}) {
  useBrowserHistory('webOnboardingMotivationPlan', true, onBack, onNext);
  const [topics, setTopics] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const { isDark } = useThemeListener();
  const { t } = useTranslations();
  useEffect(() => {
    const getTopicList = async () => {
      if (!profile || !profile.countryCode) {
        Analytics.sendDebugEvent(
          'Fetching motivation list without country code',
          profile
        );
      }
      const response = await getRecommendationList('motivation', profile);
      let userTopics =
        (profile.recommendationPreference &&
          Object.keys(profile.recommendationPreference)) ||
        [];
      if (
        !isCoachingOnboarding &&
        Array.isArray(response) &&
        response.length > 0
      ) {
        if (profile && profile.recommendationPreference) {
          userTopics = [];
          const recommendation = Object.keys(profile.recommendationPreference);
          for (let i = 0; i < response.length; i++) {
            for (let j = 0; j < recommendation.length; j++) {
              if (response[i].id === recommendation[j]) {
                userTopics.push(recommendation[j]);
              }
            }
          }
        }
      }
      const selectedTopics = [];
      userTopics.forEach((key) => {
        if (
          RECOMMENDATION_TOPICS[key] &&
          RECOMMENDATION_TOPICS[key].motivation
        ) {
          RECOMMENDATION_TOPICS[key].isActive = false;
          selectedTopics.push(RECOMMENDATION_TOPICS[key]);
        }
      });
      const map = new Map();
      const result = [];
      selectedTopics.forEach((item) => {
        if (!map.has(item.motivation)) {
          map.set(item.motivation, true); // set any value to Map
          result.push(item);
        }
      });
      if (isCoachingOnboarding || !response || !response.length)
        result.push(extraTopic);

      setTopics(result);
    };
    getTopicList();
  }, [isCoachingOnboarding, profile]);

  useEffect(() => {
    if (topics) {
      const activePreference = topics.filter((res) => {
        return res.isActive;
      });
      setCanSubmit(activePreference.length >= 1);
    }
  }, [topics]);

  const handleItemClick = (item) => {
    const newTopics = topics.map((res) => {
      if (res.unique === item.unique) {
        res.isActive = !item.isActive;
        res.selectedTime = item.selectedTime ? null : Date.now();
      }
      return res;
    });
    setTopics(newTopics);
  };

  const onContinue = () => {
    let selectedMotivations = []; // This will be sorted and sent to Mixpanel
    topics.forEach((item) => {
      if (item.isActive) {
        selectedMotivations.push(item);
      }
    });
    // Sort it - We want to get the order of the selected items. The items tapped first will be 1, 2, 3 and so on
    // We know the order though setting [selectedTime] as [Date.now()] when a motivation is selected
    // selectedMotivationObj example {"morning": 3, "sleepAnxiety": 1, "stress": 2}
    selectedMotivations = selectedMotivations.sort((a, b) => {
      return a.selectedTime - b.selectedTime;
    });
    // Converting into an Object, Currently [selectedTime] is a long timestamp [343434343434323], we want a more reasonable ordering like 1, 2, 3
    const selectedMotivationObj = {};
    selectedMotivations.forEach((motivation, index) => {
      if (motivation.unique) {
        selectedMotivationObj[motivation.unique] = index + 1;
      }
    });
    const topicList = Object.keys(selectedMotivationObj);
    const topicsOrder = topicList.map((x) => {
      return { motivation: x, order: selectedMotivationObj[x] };
    });
    const topicsCount = topicList.length;
    Analytics.track(`Motivation Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Motivation Order': topicsOrder,
      'Motivation List': topicList,
      'Motivation Count': topicsCount,
    });
    Analytics.setPeopleProperties({
      'Motivation List': topicList,
      'Motivation Count': topicsCount,
    });
    onNext({ motivationPreference: selectedMotivationObj });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_motivation_plan_what_make_these_important')}
        subtitle={t('onboarding_motivation_plan_your_answer')}
        experiments={experiments}
      />
      <div className="item-container">
        {topics &&
          topics.map((item) => (
            <MotivationItem
              key={item.unique}
              title={t(item.motivation)}
              img={item.img.uri}
              onPress={() => handleItemClick(item)}
              isActive={item.isActive}
              isDark={isDark}
            />
          ))}
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

const MotivationItem = React.memo(
  function Item({ onPress, title, img, isActive, isDark }) {
    const overlayColor = useCallback(() => {
      if (isActive) {
        return 'rgba(0,0,0,0.8)';
      }
      return 'rgba(0,0,0,0.45)';
    }, [isActive]);
    return (
      <div
        data-testid="onboardingMotivationPlan"
        className={classNames('item clickable', {
          'select-border-white': isActive,
        })}
        style={{
          backgroundImage: `linear-gradient(${overlayColor()}, ${overlayColor()}), url(${img})`,
        }}
        onClick={onPress}>
        <Text
          type="h4"
          weight="semibold"
          color={isDark ? 'b100' : 'w100'}
          align="center"
          style={{
            width: '80%',
          }}>
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
  },
  (prevProps, nextProps) => prevProps.isActive === nextProps.isActive
);
