import React, { Fragment, useEffect, useState } from 'react';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import styles from './styles';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import Text from '../../../app/Text';
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

export default function YourSleepScoreGraph({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('yourSleepScoreGraph', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();
  const [yourSleepScore, setYourSleepScore] = useState();
  const [, isMobile] = useResponsiveWindow();
  const benefitList = BENEFIT_LIST_EXP;

  const { onboardingSleepScore = {} } = profile;
  const {
    affectingEvents = {},
    bedTime = {},
    fallAsleepTime = {},
    haveChildren = {},
    hoursOfSleep = {},
    improveSleepFor = {},
    sleepDelayState = {},
  } = onboardingSleepScore;
  const totalScore = 19;

  useEffect(() => {
    const affectingEventNone = affectingEvents ? affectingEvents.none : false;
    const score =
      (!affectingEventNone && Object.keys(affectingEvents).length * -1) +
      (bedTime.score || 0) +
      (fallAsleepTime.score || 0) +
      (haveChildren.score || 0) +
      (hoursOfSleep.score || 0) +
      (improveSleepFor.score || 0) +
      (sleepDelayState.score || 0) +
      totalScore;
    let calculatedScore = Math.floor((score / totalScore) * 84);
    calculatedScore = Math.floor(calculatedScore * 0.6); // Reduce by 40%

    setYourSleepScore(calculatedScore);
  }, [
    affectingEvents,
    bedTime.score,
    fallAsleepTime.score,
    haveChildren.score,
    hoursOfSleep.score,
    improveSleepFor.score,
    totalScore,
    sleepDelayState.score,
  ]);

  function onSubmit() {
    Analytics.track(`Sleep Score`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      sleepScore: yourSleepScore,
    });
    Analytics.setPeopleProperties({
      OnboardingSleepScore: yourSleepScore,
    });
    Analytics.setSuperProperties({
      OnboardingSleepScore: yourSleepScore,
    });
    onNext({
      onboardingSleepScoreValue: yourSleepScore,
    });
  }

  return (
    <Fragment>
      <div className="header-container">
        <Header experiments={experiments} />
        <Text
          type="h3"
          color="b100"
          component="h1"
          weight="semibold"
          align="left"
          style={{ marginTop: 12 }}>
          {t('onboarding_sleep_score_sleep_score')}
          <strong>{yourSleepScore}</strong>
        </Text>
      </div>
      <div className="item-container">
        <div className="background" />

        <div
          className="graph-container"
          style={{
            marginBottom: 0,
          }}>
          {yourSleepScore < 85 && (
            <div className="line-graph-wrapper">
              <img
                src={getLocaleImage(
                  '/static/images/lineGraphs/exp-sleep-c.png',
                  currentLocale
                )}
                alt=""
                className="graph"
                style={{
                  paddingRight: isMobile && 40,
                }}
              />
              <Text
                type="h4"
                color="b100"
                style={{
                  position: 'absolute',
                  bottom: '41%',
                  left: (isMobile && '14%') || '15.5%',
                }}>
                {yourSleepScore}
              </Text>
            </div>
          )}
          {yourSleepScore > 85 && (
            <div className="line-graph-wrapper" style={{ marginBottom: 20 }}>
              <img
                src={getLocaleImage(
                  '/static/images/lineGraphs/high-sleep-c.png',
                  currentLocale
                )}
                alt="aura-graph"
                className="graph"
                style={{
                  marginTop: -78,
                  paddingRight: 10,
                }}
              />
              <Text
                type="body2"
                color="b100"
                style={{
                  position: 'absolute',
                  bottom: '38%',
                  left: '12.5%',
                  fontSize: 13,
                }}>
                {yourSleepScore}
              </Text>
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
        }}>
        {t('onboarding_sleep_score_positive_impact_chakra_exp')}
      </Text>
      <div className="aura-help-text">
        <Text
          type={'h4-large'}
          color={'b100'}
          weight={'semibold'}
          align="left"
          style={{
            lineHeight: '25px',
          }}>
          {t('onboarding_sleep_score_aura_can_help')}
        </Text>
        <div className="aura-help-text">
          {benefitList &&
            benefitList.map((item, index) => (
              <div key={index} className="list-container2">
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
      <div className="button">
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
