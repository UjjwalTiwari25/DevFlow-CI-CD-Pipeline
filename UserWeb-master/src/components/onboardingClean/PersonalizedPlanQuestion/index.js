import React, { Fragment, useCallback } from 'react';
import useTranslations from '@/hooks/translations';
import Text from '@/components/app/Text';
import OnboardingBigContinueButton from '@/components/app/OnboardingBigContinueButton';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Analytics from '@/services/Analytics';
import Header from '../Header';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';

export default function PersonalizedPlanQuestion({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('personalizedQuestion', true, onBack, onNext);
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();

  const { onboardingWellnessScoreValue, onboardingSleepScoreValue } =
    profile || {};

  const onContinue = () => {
    Analytics.track(`Personalize Plan Preference`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Personalize Plan': true,
    });
    Analytics.setSuperProperties({
      'Personalize Plan': true,
    });
    Analytics.setPeopleProperties({
      'Personalize Plan': true,
    });
    onNext({
      personalizePlan: true,
    });
  };

  const getHeaderTitle = useCallback(() => {
    return 'onboarding_personalized_question_header_aura';
  }, []);

  return (
    <Fragment>
      <Header
        title={t(getHeaderTitle(), {
          name: profile?.givenName,
        })}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="w100">
          <Text type="body" weight="semibold" color="b100" align="left">
            {t('onboarding_aura_score_your_aura_score', { score: '?' })}
          </Text>
          <div className="relative">
            <img
              className="progress-bar"
              src="/static/images/aura-score-bar.png"
              alt="aura-bar"
            />

            <div className="traget-progress">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="41"
                  height="36"
                  viewBox="0 0 41 36"
                  fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.78027 0C3.46657 0 0.780273 2.68629 0.780273 5.99999V25.3846C0.780273 28.6983 3.46657 31.3846 6.78027 31.3846H16.6269L20.4 36L24.1731 31.3846H34.0203C37.334 31.3846 40.0203 28.6983 40.0203 25.3846V6C40.0203 2.68629 37.334 0 34.0203 0H6.78027Z"
                    fill="white"
                    fillOpacity="0.08"
                  />
                </svg>
                <div className="score-container">
                  <Text
                    type="body"
                    weight="semibold"
                    color="b100"
                    style={{ lineHeight: '16px' }}>
                    85
                  </Text>
                </div>
              </div>
              <div className="progress-dot">
                <div className="white-dot"></div>
              </div>
              <Text type="footnote" color="b100" style={{ marginTop: '5px' }}>
                {t('onboarding_personalized_score_target')}
              </Text>
            </div>
          </div>
        </div>

        <div className="w100">
          <Text
            type="body2"
            align="left"
            color="b80"
            style={{ lineHeight: '18px', marginTop: '30px' }}>
            {t('onboarding_personalized_score_based_on')}
          </Text>
        </div>

        <div className="scores">
          <>
            <div className="wellness-container">
              <Text type="body" color="b100" weight="semibold">
                {t('onboarding_personalized_score_wellness_score', {
                  score: onboardingWellnessScoreValue || '?',
                })}
              </Text>
              <img
                className="progress-bar"
                src="/static/images/wellness-score-bar.png"
                alt="aura-bar"
              />
            </div>

            <div className="sleep-container">
              <Text type="body" color="b100" weight="semibold">
                {t('onboarding_personalized_score_sleep_score', {
                  score: onboardingSleepScoreValue || '?',
                })}
              </Text>
              <img
                className="progress-bar"
                src="/static/images/sleep-score-bar.png"
                alt="aura-bar"
              />
            </div>
          </>
        </div>

        <div className="button-center">
          <OnboardingBigContinueButton
            style={{
              alignSelf: 'center',
              position: 'relative',
              bottom: '20px',
              width: isMobile && '84%',
            }}
            title={t('button_continue')}
            experiments={experiments}
            onClick={() => onContinue()}
          />
        </div>
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
