import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';
import CONTENT_DURATION_OPTIONS from '../../../../data/contentDurationOptions.json';
import useThemeListener from '../../../../hooks/themeListener';

export default function PersonalizedContentDuration({
  className,
  user,
  isCoachPlan,
}) {
  const [contentDuration, setContentDuration] = useState('0-5');
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  useEffect(() => {
    if (user) {
      if (user.durationPreference) {
        setContentDuration(user.durationPreference);
      }
    }
  }, [user]);

  let duration = 'content_duration_range_3_minutes';
  let shortTitle = 'content_duration_short';
  if (contentDuration !== null) {
    duration = CONTENT_DURATION_OPTIONS.find(
      (item) => item.itemKey === contentDuration
    );
    shortTitle =
      (duration && duration.shortTitle) || t('content_duration_short');
  }
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
          align="left">
          {t('onboarding_your_plan_accomodate_schedule', { ns: 'yourplan' })}
        </Text>
        <div className="duration-container">
          {duration && (
            <div className="single-duration">
              <div className="duration">
                <img
                  src="/static/images/icons/union.png"
                  alt="clock"
                  className="duration-icon"
                />
                <div>
                  <Text
                    type="h2"
                    align="left"
                    weight="bold"
                    style={{
                      background: 'linear-gradient(to right, #FF5E8E, #609FFF)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      color: 'transparent',
                    }}>
                    {t(shortTitle)}
                  </Text>
                  <Text
                    type="body"
                    align="left"
                    color={isDark ? 'b100' : 'g100'}>
                    {t(duration.durationRange)}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
