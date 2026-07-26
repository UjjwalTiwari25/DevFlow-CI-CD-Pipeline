import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Icon } from '@aurahealth/web-design-system';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';
import { getPersonalizedFeedTopics } from '../../../../models/user';
import useThemeListener from '../../../../hooks/themeListener';
import { getTopicTitle } from '../../../../models/topic';

const MOST_POPULAR_TOPICS = [
  'sleepAnxiety',
  'stress',
  'happiness',
  'sleep',
  'selfEsteem',
  'healing',
];

export default function PersonalizedPreferences({
  className,
  user,
  isCoachPlan,
  experiments,
}) {
  const [preferences, setPreferences] = useState([
    {
      title: 'topic_title_sleep_better',
      backgroundImage:
        'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/PersonalizationTopics%2Fsmall%2FSleep.png?alt=media&token=6ca3cb81-c189-4fe5-bc34-d4032b7000ee',
    },
    {
      title: 'topic_title_calm_anxiety',
      backgroundImage:
        'https://firebasestorage.googleapis.com/v0/b/firebase-auratech16.appspot.com/o/PersonalizationTopics%2Fsmall%2FAnxiety.png?alt=media&token=d2cba28d-59a2-4aa2-b291-126ea095956f',
    },
  ]);
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  const [mostPopularTopics, setMostPopularTopics] = useState([]);

  useEffect(() => {
    if (user) {
      const { personalizedActiveFeed } = getPersonalizedFeedTopics(user);
      if (personalizedActiveFeed && personalizedActiveFeed.length > 0) {
        setPreferences(personalizedActiveFeed);
      }
    }
  }, [user]);

  useEffect(() => {
    if (preferences && preferences.length > 0) {
      // Filter preferences to get most popular topics first
      const filteredTopics = [];

      // First, add topics that are in MOST_POPULAR_TOPICS
      MOST_POPULAR_TOPICS.forEach((topicKey) => {
        const foundTopic = preferences.find((item) => item.unique === topicKey);
        if (
          foundTopic &&
          !filteredTopics.includes(foundTopic) &&
          foundTopic.helpsIn
        ) {
          filteredTopics.push(foundTopic);
        }
      });

      // Then add any remaining topics that aren't already included
      preferences.forEach((topic) => {
        if (!filteredTopics.includes(topic) && topic.helpsIn) {
          filteredTopics.push(topic);
        }
      });

      // Limit to 6 topics
      setMostPopularTopics(filteredTopics.slice(0, 6));
    }
  }, [experiments, preferences]);

  // Use mostPopularTopics if available, otherwise fall back to preferences
  const displayTopics =
    mostPopularTopics.length > 0 ? mostPopularTopics : preferences;

  return (
    <div className={`${className}`}>
      <div
        className={classNames(
          'col',
          {
            'card-white-short': isCoachPlan,
            'card-dark': isDark,
            card: !isDark,
          },
          !isCoachPlan && {
            'card-white': true,
            animation: true,
          }
        )}>
        <Text
          color="b100"
          type="h4-large"
          component="h1"
          weight="regular"
          align="left"
          style={{
            marginTop: 0,
            marginBottom: 2,
          }}>
          {t('onboarding_your_plan_based_on', { ns: 'yourplan' })}
        </Text>
        <Text
          color={isDark ? 'b64' : 'g50'}
          type="body"
          weight="regular"
          align="left">
          {t('onboarding_your_plan_personalized_topics', { ns: 'yourplan' })}
        </Text>
        <div className={classNames('topics-container wrap')}>
          {preferences &&
            preferences.map((item, index) => (
              <div className="container" key={index}>
                {isCoachPlan && (
                  <div
                    className="blur-background"
                    style={{
                      backgroundImage: `url(${
                        item.backgroundImage || item.img.uri
                      })`,
                    }}
                  />
                )}
                <div
                  className="single-topic"
                  style={{
                    backgroundImage: `linear-gradient(to bottom,rgba(0,0,0, 0.5),rgba(0,0,0,0.5)), url(${
                      item.backgroundImage || item.img.uri
                    })`,
                  }}>
                  <Text
                    type="h4"
                    color={isDark ? 'b100' : 'w100'}
                    align="center"
                    weight="bold"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                    {t(getTopicTitle(item))}
                  </Text>
                </div>
              </div>
            ))}
        </div>
        {displayTopics.length > 0 && (
          <div className="aura-will-help-you-to">
            <Text
              type="h4"
              color={isDark ? 'b100' : 'w100'}
              weight="bold"
              style={{ textShadow: 'unset' }}>
              {t('onboarding_your_plan_aura_will_help_you_to', {
                ns: 'yourplan',
              })}
            </Text>
            <div className="aura-will-help-you-to-topics">
              {displayTopics.map((item, index) =>
                !item.helpsIn ? null : (
                  <div key={index} className="aura-will-help-you-to-topic">
                    <Icon
                      name={Icon.LIST.BulletSuccessBlueFilled}
                      size={Icon.SIZES.base}
                    />

                    <Text
                      type="body2"
                      color="b100"
                      style={{ lineHeight: '18px' }}>
                      {t(item.helpsIn)}
                    </Text>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
