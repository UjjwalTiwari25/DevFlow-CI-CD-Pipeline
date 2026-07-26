import React, { Fragment, useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { getLocaleImage } from '@/models/locale';
import useBrowserHistory from '../../../../hooks/browserHistory';
import styles from './styles';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import Text from '../../../app/Text';
import AuraRingClean from '../../../app/AuraRingClean';
import Analytics from '../../../../services/Analytics';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';

const BENEFIT_LIST_EXP = [
  {
    icon: '/static/images/clock.png',
    text: 'onboarding_sleep_score_list_item_low_score1',
  },
  {
    icon: '/static/images/music.png',
    text: `onboarding_sleep_score_list_item_low_score2`,
  },
];

export default function WellnessScore({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('wellnessScore', true, onBack, onNext);
  const [yourWellnessScore, setYourWellnessScore] = useState();
  const { onboardingWellnessScore = {} } = profile;
  const { currentLocale } = useTranslations();
  const [, isMobile] = useResponsiveWindow();
  const {
    anxiousState = {},
    botheringEvents = {},
    burnoutExperience = {},
    burnoutSource = {},
    relaxStruggle = {},
    sleepStatement = {},
    stressTime = {},
    motivationState = {},
    moodSwingState = {},
  } = onboardingWellnessScore;

  const { t } = useTranslations();
  useEffect(() => {
    const botheringEventsNone = botheringEvents ? botheringEvents.none : false;
    const score =
      (!botheringEventsNone && Object.keys(botheringEvents).length * -1) +
      (anxiousState.score || 0) +
      (burnoutExperience.score || 0) +
      (Object.keys(burnoutSource).length * -1 || 0) +
      (relaxStruggle.score || 0) +
      (sleepStatement.score || 0) +
      (stressTime.score || 0) +
      (motivationState.score || 0) +
      (moodSwingState.score || 0) +
      17;

    let calculatedScore = Math.floor((score / 17) * 84);
    calculatedScore = Math.floor(calculatedScore * 0.6); // Reduce by 40%
    setYourWellnessScore(calculatedScore);
  }, [
    anxiousState.score,
    botheringEvents,
    burnoutExperience.score,
    burnoutSource,
    burnoutSource.score,
    relaxStruggle.score,
    sleepStatement.score,
    stressTime.score,
    motivationState.score,
    moodSwingState.score,
  ]);
  function onSubmit() {
    Analytics.track(`Wellness Score`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      wellnessScore: yourWellnessScore,
    });
    Analytics.setPeopleProperties({
      OnboardingWellnessScore: yourWellnessScore,
    });
    Analytics.setSuperProperties({
      OnboardingWellnessScore: yourWellnessScore,
    });
    onNext({
      onboardingWellnessScoreValue: yourWellnessScore,
    });
  }

  const scorePosition = () => {
    if (isMobile) return '7.5%';
    return '18%';
  };

  return (
    <Fragment>
      <AuraRingClean
        style={{
          marginTop: 4,
          marginLeft: -14,
        }}
        size={76}
      />
      <Text
        type="h3"
        color="b100"
        component="h1"
        weight="semibold"
        align={'left'}
        style={{ marginTop: 12, width: '100%' }}>
        {t('onboarding_wellness_score_wellness_score_exp', {
          score: I18NFormatter.formatNumber(yourWellnessScore),
        })}
      </Text>

      <div className="item-container">
        <div className="graph-container">
          {yourWellnessScore < 85 && (
            <div className="line-graph-wrapper">
              <img
                src={getLocaleImage(
                  '/static/images/lineGraphs/exp-mental-c.png',
                  currentLocale
                )}
                alt=""
                className="graph"
                style={{
                  paddingRight: isMobile && 40,
                  paddingLeft: !isMobile && 10,
                  margin: !isMobile && '51px 0 34px',
                }}
              />
              <Text
                type="h4"
                color="b100"
                style={{
                  position: 'absolute',
                  bottom: !isMobile ? '23%' : '20%',
                  left: scorePosition(),
                }}>
                {yourWellnessScore}
              </Text>
            </div>
          )}
          {yourWellnessScore > 85 && (
            <div className="line-graph-wrapper">
              <>
                <img
                  src={getLocaleImage(
                    '/static/images/lineGraphs/high-mental-c.png',
                    currentLocale
                  )}
                  alt="aura-graph"
                  className="graph"
                  style={{
                    marginTop: -80,
                  }}
                />
                <Text
                  type="body2"
                  color="b100"
                  style={{
                    position: 'absolute',
                    bottom: '31.5%',
                    left: (isMobile && '6.5%') || '13%',
                  }}>
                  {yourWellnessScore}
                </Text>
              </>
            </div>
          )}
        </div>
      </div>
      <Text
        type="body2"
        color="b100"
        align="left"
        style={{
          lineHeight: '18px',
          marginTop: '30px',
        }}>
        {t('onboarding_wellness_score_positive_impact_chakra_exp')}
      </Text>
      <div className="aura-help-text">
        <Text
          type="h4-large"
          color="b100"
          weight="semibold"
          align="left"
          style={{
            lineHeight: '25px',
            marginBottom: '16px',
            marginTop: '32px',
          }}>
          {t('onboarding_sleep_score_aura_can_help')}
        </Text>
        <div className="aura-help-text">
          {BENEFIT_LIST_EXP.map((item, index) => (
            <div key={index} className="list-container">
              <div>
                <div className="icon-container">
                  <img src={item.icon} alt="icon" className="icon" />
                </div>
              </div>
              <Text type="body2" color="b64" style={{ lineHeight: '18px' }}>
                {t(item.text)}
              </Text>
            </div>
          ))}
        </div>
      </div>
      <OnboardingBigContinueButton
        title={t('button_continue')}
        experiments={experiments}
        onClick={() => {
          onSubmit();
        }}
      />
      <style jsx>{styles}</style>
    </Fragment>
  );
}
