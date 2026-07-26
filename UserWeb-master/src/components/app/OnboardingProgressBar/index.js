import React, { useRef } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import usePreviousValue from '@/hooks/previousValue';
import Text from '../Text';
import styles, {
  progressBarAnimation,
  dividedProgressBarAnimation,
} from './styles';

const START_COLOR = '#000';
const END_COLOR = '#000';
export default function OnboardingProgressBar({
  total,
  maxProgress,
  style,
  step,
  startColor,
  endColor,
  currentScreenIndex,
  totalScreens,
  hideSteps,
  hideTitle,
  progressBarStyles,
  isPersonalizedBar,
  profile,
  isSplitProgressBar,
}) {
  const { t } = useTranslations();
  const previousStep = usePreviousValue(step);
  const previousEnd = usePreviousValue();
  const progressBarRef = useRef();
  const extraSpace = 0;

  function calculateProgressRange({
    isPersonalizedBar: personalizedBar,
    isSplitProgressBar: splitProgressBar,
    step: currentStep,
    previousStep: prevStep,
    total: totalSteps,
    maxProgress: max,
    extraSpace: additionalSpace,
    currentScreenIndex: screenIndex,
    totalScreens: screensTotal,
    previousEnd: prevEnd,
  }) {
    let progressTotalLength = max || 100;
    let start;
    let end;

    if (!personalizedBar) {
      start = (prevStep / totalSteps) * progressTotalLength;
      end = (currentStep / totalSteps) * progressTotalLength + additionalSpace;
    } else if (personalizedBar && !splitProgressBar) {
      start = prevEnd || 0;
      end = ((screenIndex + 1) / screensTotal) * (84 + additionalSpace);
    } else {
      let previousProgressTotalLength = 0;

      // Three sections: Mental Wellness (0-33), Sleep (34-66), Interests & Goals (67-100)
      if (max < 34) {
        previousProgressTotalLength = 0;
        progressTotalLength = 33 + additionalSpace - 6.5;
      } else if (max < 67) {
        previousProgressTotalLength = 33;
        progressTotalLength = 32 + additionalSpace - 6.5;
      } else {
        previousProgressTotalLength = 66;
        progressTotalLength = 34 + additionalSpace - 15.5;
      }

      start = prevEnd || previousProgressTotalLength;
      end =
        previousProgressTotalLength +
        ((screenIndex + 1) / screensTotal) * progressTotalLength;
    }

    return { start, end };
  }

  const { start, end } = calculateProgressRange({
    isPersonalizedBar,
    isSplitProgressBar,
    step,
    previousStep,
    total,
    maxProgress,
    extraSpace,
    currentScreenIndex,
    totalScreens,
    previousEnd,
  });
  const dividedBarWidth = progressBarRef.current?.offsetWidth;
  const { styles: animationStyles } = progressBarAnimation(
    true,
    startColor || START_COLOR,
    endColor || END_COLOR,
    end,
    start
  );
  const { className: expProgressAnimation, styles: expAnimationStyles } =
    dividedProgressBarAnimation(end, start);

  const getStepsTitle = () => {
    if (!isPersonalizedBar) return t('onboarding_progress_bar_goals');

    if (maxProgress < 34) {
      return t('onboarding_progress_bar_mental_wellness');
    }
    if (maxProgress < 67) {
      return t('onboarding_progress_bar_sleep');
    }
    if (maxProgress >= 67 && maxProgress <= 100) {
      return t('onboarding_progress_bar_interests_and_goals');
    }
    return t('onboarding_progress_bar_goals');
  };

  return (
    <div
      className={classNames('progress-wrapper vertical-align')}
      style={progressBarStyles}>
      <div
        className={classNames('progress-bar-container', {
          'progress-bar-container-hide-steps': hideSteps,
        })}>
        <div className="w-100">
          <div style={style}>
            <div
              className="row w-100 h-100 bar-gap relative"
              ref={progressBarRef}>
              {(typeof profile?.personalizePlan !== 'undefined' &&
                profile.personalizePlan &&
                isSplitProgressBar) ||
              (isSplitProgressBar &&
                typeof profile?.recommendationPreference !== 'undefined' &&
                profile.recommendationPreference) ? (
                <>
                  <div className="bar-white-background bar goals-bar"></div>
                  <div className="bar-white-background bar mental-wellness-bar"></div>
                  <div className="bar-white-background bar sleep-bar"></div>
                </>
              ) : (
                <div
                  className="bar-white-background bar goals-bar"
                  style={{ width: '100%' }}></div>
              )}
            </div>
            <div
              className={classNames(
                `${expProgressAnimation} colorful-animation-area-wrapper`
              )}
              style={{
                maxWidth: dividedBarWidth,
              }}>
              <div
                className="gray-bar"
                style={{
                  borderRadius: '24px',
                  width: dividedBarWidth,
                  gap: 8,
                }}>
                {(typeof profile?.personalizePlan !== 'undefined' &&
                  profile.personalizePlan &&
                  isSplitProgressBar) ||
                (isSplitProgressBar &&
                  typeof profile?.recommendationPreference !== 'undefined' &&
                  profile.recommendationPreference) ? (
                  <>
                    <div className="progress-bar goals-progress-bar"></div>
                    <div className="progress-bar mental-wellness-progress-bar"></div>
                    <div className="progress-bar sleep-progress-bar"></div>
                  </>
                ) : (
                  <div className="progress-bar goals-progress-bar-full"></div>
                )}
              </div>
            </div>
          </div>
          {expAnimationStyles}
          {animationStyles}
        </div>
      </div>
      {!hideSteps && (
        <div
          className="small-step-title-container"
          style={{
            width: '100%',
            justifyContent: hideTitle ? 'flex-end' : 'space-between',
          }}>
          {!hideTitle && (
            <Text
              type="body"
              weight="semibold"
              align="left"
              style={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: '12px',
                lineHeight: '15px',
              }}>
              {getStepsTitle()}
            </Text>
          )}

          <div style={{ minWidth: '50px' }}>
            <Text
              type="body"
              weight="semibold"
              align="right"
              style={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: '12px',
                lineHeight: '15px',
              }}>
              {currentScreenIndex + 1} / {totalScreens}
            </Text>
          </div>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
