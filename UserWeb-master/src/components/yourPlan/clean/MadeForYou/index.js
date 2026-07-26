import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import TOPICS from '../../../../data/topics.json';
import styles from './styles';
import useThemeListener from '../../../../hooks/themeListener';

export default function MadeForYouClean({
  personalizedTopics,
  style,
  user,
  className,
}) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  let displayTopics = Object.values(TOPICS);
  if (personalizedTopics) {
    displayTopics.unshift(...personalizedTopics);
  }
  displayTopics = displayTopics.slice(0, 3);

  return (
    <div className={`card ${className}`} style={style}>
      <div className="wrapper">
        <div className="background" />
        <div id="padding-content " className="animation">
          <Text type="h3-large" weight="regular" color="b100" align="left">
            {t('onboarding_your_plan_made_for_you', {
              name: user && user.givenName ? user.givenName : 'You',
              ns: 'yourplan',
            })}
          </Text>
          <Text
            type="body"
            weight="regular"
            color={isDark ? 'b64' : 'g50'}
            align="left"
            style={{
              marginTop: 12,
              marginBottom: 16,
              lineHeight: '17px',
            }}>
            {t('onboarding_your_plan_personalized_plans', {
              topic1: t(displayTopics[0].topicName),
              topic2: t(displayTopics[1].topicName),
              topic3: t(displayTopics[2].topicName),
              ns: 'yourplan',
            })}
          </Text>
        </div>
        <div className="animation mfy-playlist-container">
          <div className="background"></div>
          {displayTopics
            .splice(0, 2)
            .map((topic) =>
              topic.madeForYouMix && topic.madeForYouMix.img ? (
                <img
                  src={topic.madeForYouMix.img.uri}
                  alt={topic.madeForYouMix.title}
                  key={topic.unique}
                  className="playlist-card"
                />
              ) : null
            )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
