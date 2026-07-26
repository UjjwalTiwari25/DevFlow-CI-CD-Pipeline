import React, { Fragment, useState, useEffect } from 'react';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import Text from '@/components/app/Text';
import OnboardingBigContinueButton from '@/components/app/OnboardingBigContinueButton';
import Analytics from '@/services/Analytics';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';
import Header from '../Header';

export default function PersonalizedAuraScore({
  onNext,
  onBack,
  experiments,
  profile,
}) {
  useBrowserHistory('personalizedAuraScore', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();

  const [auraScore, setAuraScore] = useState();
  const [wellnessScore, setWellnessScore] = useState();
  const [sleepScore, setSleepScore] = useState();

  useEffect(() => {
    if (profile) {
      const { onboardingSleepScoreValue, onboardingWellnessScoreValue } =
        profile;
      setAuraScore(
        Math.floor(
          (onboardingSleepScoreValue + onboardingWellnessScoreValue) / 2
        ) || 66
      );
      setWellnessScore(onboardingWellnessScoreValue || 79);
      setSleepScore(onboardingSleepScoreValue || 66);
    }
  }, [profile]);

  function onSubmit() {
    Analytics.track(`Aura Score`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      auraScore,
    });
    Analytics.setPeopleProperties({
      OnboardingAuraScore: auraScore,
    });
    Analytics.setSuperProperties({
      OnboardingAuraScore: auraScore,
    });
    onNext({
      onboardingAuraScoreValue: auraScore,
    });
  }

  return (
    <Fragment>
      <Header
        title={t('onboarding_personalized_header', {
          givenName: profile?.givenName,
        })}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="w100">
          <Text
            type="body"
            weight="semibold"
            color="b100"
            align="left"
            style={{ marginBottom: '12px' }}>
            {t('onboarding_personalized_score_overall_score', {
              score: auraScore,
            })}
          </Text>
          <div style={{ position: 'relative' }}>
            <div className="progress-bar-grey"></div>

            <div className="progress-bar-shaded aura-gradient"></div>

            <div
              className="current-progress aura-gradient"
              style={{ width: !!auraScore && `${auraScore}%` }}></div>

            <div className="target">
              <div className="target-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="7"
                  height="4"
                  viewBox="0 0 7 4"
                  fill="none">
                  <path
                    d="M3.5 4L6.5 -4.76995e-08L0.5 4.76837e-07L3.5 4Z"
                    fill="white"
                  />
                </svg>
              </div>
              <Text
                type="body2"
                color="b100"
                weight="semibold"
                style={{ lineHeight: '17px' }}>
                85
              </Text>
              <Text type="footnote" color="b100">
                {t('onboarding_personalized_score_target')}
              </Text>
            </div>
          </div>

          <div className="w100">
            <Text
              type="body2"
              align="left"
              color="b100"
              style={{ lineHeight: '18px', marginTop: '51px' }}>
              {t('onboarding_personalized_score_based_on')}
            </Text>
          </div>

          <div className="scores">
            <div className="wellness-container">
              <Text
                type="body"
                color="b64"
                weight="semibold"
                style={{ margin: '4px 0' }}>
                {t('onboarding_personalized_score_wellness_score', {
                  score: wellnessScore,
                })}
              </Text>

              <div style={{ position: 'relative' }}>
                <div className="progress-bar-grey"></div>
                <div className={`progress-bar-shaded sleep-gradient`}></div>
                <div
                  className={`current-progress sleep-gradient`}
                  style={{
                    width: !!wellnessScore && `${wellnessScore}%`,
                  }}></div>

                <div className="target2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="none">
                    <path
                      d="M3.5 4L6.5 -4.76995e-08L0.5 4.76837e-07L3.5 4Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="sleep-container">
              <Text
                type="body"
                color="b64"
                weight="semibold"
                style={{ margin: '4px 0' }}>
                {t('onboarding_personalized_score_sleep_score', {
                  score: sleepScore,
                })}
              </Text>

              <div style={{ position: 'relative' }}>
                <div className="progress-bar-grey"></div>
                <div className={`progress-bar-shaded wellness-gradient`}></div>
                <div
                  className={`current-progress  wellness-gradient`}
                  style={{
                    width: !!sleepScore && `${sleepScore}%`,
                  }}></div>

                <div className="target2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="7"
                    height="4"
                    viewBox="0 0 7 4"
                    fill="none">
                    <path
                      d="M3.5 4L6.5 -4.76995e-08L0.5 4.76837e-07L3.5 4Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="social-proof-container">
          <img
            src={getLocaleImage(
              '/static/images/best-of-apps-winner.png',
              currentLocale
            )}
            alt="best of apps"
            style={{ width: '84px', height: '62px' }}
            className="social-proof"
          />
          <img
            src={getLocaleImage(
              '/static/images/award-2023-winner.png',
              currentLocale
            )}
            alt="award winner"
            style={{ width: '93px', height: '61px' }}
            className="social-proof"
          />
        </div>
        <OnboardingBigContinueButton
          title={t('onboarding_personalized_score_button_get_plan')}
          experiments={experiments}
          onClick={() => onSubmit()}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
