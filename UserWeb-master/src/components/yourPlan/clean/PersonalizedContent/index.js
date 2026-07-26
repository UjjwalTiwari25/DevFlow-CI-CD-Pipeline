import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';
import CONTENT_TYPES_EXTENTDED from '../../../../data/onboardingContentTypesExtended.json';
import useThemeListener from '../../../../hooks/themeListener';
import { getUserContentTypePreference } from '../../../../models/user';

export default function PersonalizedContent({ className, user, isCoachPlan }) {
  const [contentType, setContentType] = useState(['mindfulness']);
  const { isDark } = useThemeListener();
  const contentTypes = contentType.slice(0, 2);
  const { t } = useTranslations();
  useEffect(() => {
    if (user) {
      if (user.contentTypePreference) {
        setContentType(getUserContentTypePreference(user));
      }
    }
  }, [user]);

  return (
    <div className={`${className}`}>
      <div className="background" />

      <div
        className={classNames('card-white col', {
          'card-dark': isDark,
          card: !isDark,
          animation: isCoachPlan,
        })}>
        <Text
          color="b100"
          type="h4-large"
          component="h1"
          weight="regular"
          align="left"
          style={{ maxWidth: isCoachPlan ? 330 : 290 }}>
          {t('onboarding_your_plan_content_tailored', { ns: 'yourplan' })}
        </Text>
        <div className="sounds-container">
          {contentTypes &&
            CONTENT_TYPES_EXTENTDED &&
            contentTypes.map((item, index) => (
              <div
                className="single-sound"
                key={index}
                style={{
                  backgroundImage: `linear-gradient(to bottom,rgba(0,0,0, 0.5),rgba(0,0,0,0.5)), url(${CONTENT_TYPES_EXTENTDED[item]?.fullImage})`,
                }}>
                {CONTENT_TYPES_EXTENTDED[item] && (
                  <div className="prefernce-container">
                    {CONTENT_TYPES_EXTENTDED[item].minimalIcon && (
                      <img
                        src={`${CONTENT_TYPES_EXTENTDED[item].minimalIcon}`}
                        alt="sound icon"
                        className="sound-icon"
                      />
                    )}
                    <Text
                      type="h4"
                      color={isDark ? 'b100' : 'w100'}
                      align="center"
                      weight="bold">
                      {t(CONTENT_TYPES_EXTENTDED[item]?.title) ||
                        t('content_type_meditation')}
                    </Text>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
