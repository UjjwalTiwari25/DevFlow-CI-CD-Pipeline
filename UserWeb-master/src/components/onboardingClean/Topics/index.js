import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import LoginModal from '@/components/login/LoginModal';
import usePageQuery from '@/hooks/pageQuery';
import { MdCheck } from 'react-icons/md';
import classNames from 'classnames';
import { getIdBySlug } from '@/models/celebrities';
import useTranslations from '@/hooks/translations';
import PodscribePixel from '@/services/PodscribePixel';
import I18NFormatter from '@/services/I18NFormatter';
import Text from '../../app/Text';
import Header from '../Header';
import TOPICS from '../../../data/topics.json';
import Analytics from '../../../services/Analytics';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles, { itemStyle } from './styles';
import useThemeListener from '../../../hooks/themeListener';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';

const CHAKRA_TOPICS = [
  'happiness',
  'healing',
  'stress',
  'sleepAnxiety',
  'selfEsteem',
  'sleep',
  'morning',
  'advanced',
  'relationships',
  'gratitude',
  'mindfulness',
  'focus',
  'relaxation',
  'parenting',
  'yoga',
  'anger',
  'kids',
  'personalGrowth',
  'beginner',
  'boostEnergy',
  'musicSoothing',
];

export default function Topics({
  onNext,
  onBack,
  profile,
  isCoachingOnboarding,
  experiments,
}) {
  const pageQuery = usePageQuery();
  const { celeb_id: celebrityId = null } = pageQuery;
  useBrowserHistory('topics', true, onBack, onNext);
  const loginModalRef = useRef(null);
  const [topics, setTopics] = useState([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  const submitLength = useCallback(() => {
    if (isCoachingOnboarding) {
      return 2;
    }
    return 6;
  }, [isCoachingOnboarding]);

  const getCtaText = useCallback(() => {
    return 'onboarding_topics_button_disabled';
  }, []);

  useEffect(() => {
    const chakraTopics = CHAKRA_TOPICS.map((topic) => {
      return {
        ...TOPICS[topic],
        unique: topic,
      };
    });
    setTopics(chakraTopics);
  }, []);

  useEffect(() => {
    if (topics) {
      const activePreference = topics.filter((res) => {
        return res.isActive;
      });
      setCanSubmit(activePreference.length >= submitLength());
    }
  }, [isCoachingOnboarding, submitLength, topics]);

  const handleItemClick = (item) => {
    setTopics((prevTopics) => {
      const isActivating = !item.isActive;

      const newTopics = prevTopics.map((res) => {
        if (res.unique === item.unique) {
          return {
            ...res,
            isActive: isActivating,
            selectedTime: isActivating ? Date.now() : null,
          };
        }
        return res;
      });

      return newTopics;
    });
  };

  const onContinue = () => {
    PodscribePixel.lead();
    let selectedPreferenceArr = []; // This will be sorted and sent to Mixpanel
    topics.forEach((item) => {
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
      if (preference.unique) {
        selectedPreferenceObj[preference.unique] = index + 1;
      }
    });
    const topicList = Object.keys(selectedPreferenceObj);
    const topicsOrder = topicList.map((x) => {
      return { topic: x, order: selectedPreferenceObj[x] };
    });
    const topicsCount = topicList.length;
    Analytics.track(`Personalized Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      Topics: topicsOrder,
      'Topic List': topicList,
      'Topic Count': topicsCount,
    });
    Analytics.setPeopleProperties({
      'Topic List': topicList,
      'Topic Count': topicsCount,
    });
    onNext({ recommendationPreference: selectedPreferenceObj });
  };

  const getHeadetText = useCallback(() => {
    if (!isCoachingOnboarding) {
      return 'onboarding_topics_welcome';
    }

    return 'onboarding_topics_welcome2';
  }, [isCoachingOnboarding]);

  const getTopicButtonText = (topic) => {
    if (topic.buttonTitleChakra) {
      return topic.buttonTitleChakra;
    }
    if (topic.buttonTitle) {
      return topic.buttonTitle;
    }
    return topic.title;
  };

  return (
    <Fragment>
      <Header
        title={t(getHeadetText(), {
          givenName: profile?.givenName,
        })}
        subtitle={
          !isCoachingOnboarding &&
          t('onboarding_topics_choose_topics', {
            count: I18NFormatter.formatNumber(submitLength()),
          })
        }
        experiments={experiments}
      />
      {celebrityId && celebrityId === getIdBySlug('greg-louganis') && (
        <div
          className="login-text clickable"
          onClick={() => {
            if (loginModalRef.current) {
              loginModalRef.current.show();
            }
          }}>
          <Text
            type="h4"
            color="b100"
            weight="semibold"
            style={{ lineHeight: '22px' }}>
            {t('onboarding_topics_button_log_in')}
          </Text>
        </div>
      )}

      <div className="item-container">
        {topics &&
          topics.map((topic) => {
            return isDark ? (
              <TopicItemDark
                key={topic.unique}
                onboardingLabel={topic.onboardingLabel}
                onboardingLabelValue={t(topic.onboardingLabel)}
                title={t(getTopicButtonText(topic))}
                img={topic.img.uri}
                onPress={() => handleItemClick(topic)}
                isActive={topic.isActive}
                experiments={experiments}
                topicCount={topic.count}
              />
            ) : (
              <TopicItem
                key={topic.unique}
                title={t(getTopicButtonText(topic))}
                img={topic.img.uri}
                onPress={() => handleItemClick(topic)}
                isActive={topic.isActive}
                experiments={experiments}
              />
            );
          })}
      </div>
      <div className="button-container">
        <OnboardingBigContinueButton
          title={
            canSubmit
              ? t('button_continue')
              : t(getCtaText(), {
                  count: I18NFormatter.formatNumber(submitLength()),
                })
          }
          experiments={experiments}
          onClick={onContinue}
          disabled={!canSubmit}
        />
      </div>
      <LoginModal ref={loginModalRef} />
      <style jsx>{styles}</style>
    </Fragment>
  );
}

const TopicItem = React.memo(
  function Item({ onPress, title, img, isActive }) {
    const overlayColor = isActive ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.45)';

    return (
      <div
        data-testid="onboardingTopicItem"
        className="item clickable"
        style={{
          background: `linear-gradient(${overlayColor}, ${overlayColor}), url(${img})`,
        }}
        onClick={onPress}>
        <Text
          type="h4"
          weight="semibold"
          color="w100"
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
  },
  (prevProps, nextProps) =>
    prevProps.isActive === nextProps.isActive &&
    prevProps.topics === nextProps.topics &&
    prevProps.title === nextProps.title
);

const TopicItemDark = React.memo(
  function Item({
    onPress,
    title,
    img,
    isActive,
    onboardingLabel,
    onboardingLabelValue,
  }) {
    const overlayColor = useCallback(() => {
      if (isActive) {
        return 'rgba(0,0,0,0.8)';
      }
      return 'rgba(0,0,0,0.45)';
    }, [isActive]);

    return (
      <div
        className={classNames('item clickable increase-margin-bottom', {
          'select-border-white': isActive,
        })}
        data-testid="onboardingTopicItem"
        style={{
          background: `linear-gradient(${overlayColor()}, ${overlayColor()}), url(${img})`,
        }}
        onClick={onPress}>
        <Text
          type="h4"
          weight="semibold"
          color="b100"
          align="center"
          style={{ width: '80%' }}>
          {title}
        </Text>
        {isActive && (
          <div className="check-mark">
            <MdCheck />
          </div>
        )}
        {onboardingLabel && (
          <div
            className={classNames('label-container', {
              'green-background':
                onboardingLabel === 'onboarding_badge_label_popular',
              'gray-background':
                onboardingLabel === 'onboarding_topics_badge_recommended',
              'blue-background':
                onboardingLabel === 'onboarding_topics_badge_new_topic',
            })}>
            <Text
              type="body2"
              weight="semibold"
              color="b100"
              align="center"
              style={{
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                lineHeight: '17px',
              }}>
              {onboardingLabelValue}
            </Text>
          </div>
        )}
        <style jsx>{itemStyle}</style>
      </div>
    );
  },
  (prevProps, nextProps) =>
    prevProps.isActive === nextProps.isActive &&
    prevProps.topics === nextProps.topics &&
    prevProps.title === nextProps.title
);
