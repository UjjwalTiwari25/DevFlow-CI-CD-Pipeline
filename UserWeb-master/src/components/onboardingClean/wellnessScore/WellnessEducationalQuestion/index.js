import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import styles from './styles';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';

export default function WellnessEducationalQuestion({
  onNext,
  onBack,
  experiments,
}) {
  useBrowserHistory('wellnessEducationalQuestion', true, onBack, onNext);
  const { t } = useTranslations();

  function onSubmit() {
    onNext();
  }

  return (
    <Fragment>
      <div className="header-container">
        <Header
          experiments={experiments}
          title={t('onboarding_educational_wellness_screens_header')}
          subtitle={t('onboarding_educational_wellness_screens_subtitle')}
        />
      </div>
      <div className="item-container">
        <div
          className="graph-container"
          style={{
            marginBottom: 0,
          }}>
          <img
            src="/static/images/wellnessQuestion.png"
            alt="sleep-question"
            className="graph"
          />
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
