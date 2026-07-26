import React, { useEffect, useState, Fragment } from 'react';
import classNames from 'classnames';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import Text from '../../../app/Text';
import useThemeListener from '../../../../hooks/themeListener';
import useInterval from '../../../../hooks/interval';
import useBrowserHistory from '../../../../hooks/browserHistory';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import styles from './styles';

const AGE_RANGE_OPTIONS = {
  a: {
    ageRangeKey: 'onboarding_age_range_a',
  },
  b: {
    ageRangeKey: 'onboarding_age_range_b',
  },
  c: {
    ageRangeKey: 'onboarding_age_range_c',
  },
  d: {
    ageRangeKey: 'onboarding_age_range_d',
  },
  e: {
    ageRangeKey: 'onboarding_age_range_e',
  },
};

export default function LoaderSleepGraph({
  onNext,
  onBack,
  experiments,
  profile,
}) {
  useBrowserHistory('loaderSleepGraph', true, onBack, onNext);
  const [progressBar, setProgressBar] = useState(0);
  const [randomNumber, setRandomNumber] = useState();
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  useInterval(
    () => {
      setProgressBar(progressBar + 1);
    },
    progressBar >= 100 ? null : 50
  );

  useEffect(() => {
    const randomNumbers =
      Math.floor(Math.random() * (502000 - 2300202 + 1)) + 2300202;
    function numberWithCommas() {
      return randomNumbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    setRandomNumber(numberWithCommas);
  }, []);

  return (
    <Fragment>
      <div className="header-container">
        <Header
          title={`We've helped ${randomNumber} ${
            profile.gender === 'male' ? 'men' : 'women'
          } ${t(
            AGE_RANGE_OPTIONS[profile.ageGroup].ageRangeKey
          )} improve their sleep`}
        />
      </div>
      <div className="graph-container">
        <img
          src="static/images/loaderSleepGraph-a.png"
          style={{ marginBottom: -60 }}
          alt="loader-graph-image"
          className="graph-image"
        />
      </div>
      <div className="progress-container">
        <div className="shadow-wrapper">
          <div
            className={classNames('container-styles', {
              'bar-light-background': !isDark,
              'bar-dark-background': isDark,
            })}>
            <div className="filler-styles" style={{ width: `${progressBar}%` }}>
              <Text
                type="body2"
                weight="semibold"
                style={{
                  marginRight: 15,
                }}
                color={isDark ? 'b100' : 'w100'}>
                {`${progressBar}%`}
              </Text>
            </div>
          </div>
          <div
            className="filler-styles-absolute"
            style={{ width: `${progressBar}%` }}></div>
        </div>
        <div>
          <Text
            type="body2"
            align="center"
            weight="semibold"
            style={{
              marginTop: 24,
              background:
                'linear-gradient(90deg, #67F6CB 0%, #809CFF 48.31%, #F664DE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}>
            {t('onboarding_loader_sleep_graph_analyzing_responses')}
          </Text>
        </div>
      </div>
      <div className="button">
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={() => {
            onNext();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
