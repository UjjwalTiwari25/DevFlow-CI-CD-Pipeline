import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';
import useInterval from '../../../../hooks/interval';
import useThemeListener from '../../../../hooks/themeListener';

const CONFIG = {
  tracks: { limit: 1000, increment: 8, delay: 35 },
  coaches: { limit: 100, increment: 1, delay: 45 },
};

// Custom hook for animated counter
const useAnimatedCounter = (config, initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prevCount) => {
      // Safety check: if already at or above limit, don't increment
      if (prevCount >= config.limit) {
        return prevCount;
      }
      const maxIncrement = Math.min(config.increment, config.limit - prevCount);
      return prevCount + maxIncrement;
    });
  }, [config.increment, config.limit]);

  const isComplete = count >= config.limit;

  useInterval(increment, isComplete ? null : config.delay);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  // Reset when config changes
  useEffect(() => {
    setCount(0);
  }, [config.limit, config.increment, config.delay]);

  return { count, isComplete, reset };
};

export default function TherapistsCounter({
  className,
  style,
  user,
  experiments,
}) {
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  // Get configuration based on experiment variant
  const config = CONFIG;

  // Initialize counters
  const tracksCounter = useAnimatedCounter(config.tracks);
  const coachesCounter = useAnimatedCounter(config.coaches);

  // Early return if no experiments
  if (Object.keys(experiments).length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <div
        className={classNames('col', {
          'card-dark': isDark,
          card: !isDark,
          animation: true,
        })}
        style={style}>
        <Text
          color="b100"
          type={'h4-large'}
          component="h1"
          weight={'regular'}
          align="left"
          style={{
            marginTop: 0,
            marginBottom: 2,
          }}>
          {!user?.personalizePlan
            ? t('onboarding_your_plan_your_personalized_plan_exp', {
                ns: 'yourplan',
              })
            : t('onboarding_your_plan_your_personalized_plan', {
                ns: 'yourplan',
              })}
        </Text>
        <Text
          color={isDark ? 'b64' : 'g50'}
          type={'body'}
          weight="regular"
          align="left">
          {t('onboarding_your_plan_analyzed_responses', { ns: 'yourplan' })}
        </Text>
        <div className={classNames('counter-container')}>
          <div>
            <div className={classNames('tracks_counter')}>
              <Text type={'h2'} align="left" color="b100" weight="bold">
                {t('counter_text', { count: tracksCounter.count })}
              </Text>
            </div>
            <Text
              type={'body'}
              align="left"
              color={isDark ? 'b100' : 'g100'}
              weight="regular"
              style={{
                maxWidth: 123,
              }}>
              {t('onboarding_your_plan_tracks_to_use', { ns: 'yourplan' })}
            </Text>
          </div>
          <div>
            <div className={classNames('therapists_counter')}>
              <Text type="h2" align="left" color="b100" weight="bold">
                {t('counter_text', { count: coachesCounter.count })}
              </Text>
            </div>
            <Text
              type="body"
              align="left"
              color={isDark ? 'b100' : 'g100'}
              weight="regular"
              style={{
                maxWidth: 123,
              }}>
              {t('onboarding_your_plan_therapists', { ns: 'yourplan' })}
            </Text>
          </div>
        </div>
        <style jsx>{styles}</style>
      </div>
    </div>
  );
}
