import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../../hooks/browserHistory';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import Header from '../../Header';
import styles from './styles';

export default function AwardWinningApp({ onNext, onBack, experiments }) {
  useBrowserHistory('awardWinningApp', true, onBack, onNext);
  const { t } = useTranslations();

  const onContinue = () => {
    onNext();
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_award_winning_app_header_you_get_access')}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="background" />
        <img
          src="/static/images/coachingOnboarding/phone.png"
          alt="phone"
          className="image"
        />
      </div>
      <OnboardingBigContinueButton
        title={t('button_continue')}
        experiments={experiments}
        onClick={onContinue}
      />
      <style jsx>{styles}</style>
    </Fragment>
  );
}
