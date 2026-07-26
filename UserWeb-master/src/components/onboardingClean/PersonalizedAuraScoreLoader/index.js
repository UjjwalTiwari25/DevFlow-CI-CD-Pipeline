import React, { Fragment, useState } from 'react';
import useTranslations from '@/hooks/translations';
import Text from '@/components/app/Text';
import { getLocaleImage } from '@/models/locale';
import useInterval from '@/hooks/interval';
import useBrowserHistory from '../../../hooks/browserHistory';
import styles from './styles';
import Header from '../Header';

export default function PersonalizedAuraScoreLoader(props) {
  const { onNext, onBack, experiments, profile } = props;
  useBrowserHistory('personalizedAuraScoreLoader', true, onBack, onNext);
  const { t, currentLocale } = useTranslations();
  const [percentage, setPercentage] = useState(0);

  useInterval(
    () => {
      setPercentage(percentage + 1);
    },
    percentage >= 100 ? null : 39
  );

  if (percentage === 100) onNext();

  return (
    <Fragment>
      <Header
        title={t('onboarding_personalized_header', {
          givenName: profile?.givenName,
        })}
        experiments={experiments}
      />
      <div className="item-container">
        <div className="loader">
          <svg id="main-loader">
            <linearGradient id="linearColor1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#84BCFF"></stop>
              <stop offset="70%" stopColor="#FFADF7"></stop>
            </linearGradient>
            <linearGradient id="linearColor2" x1="0.5" y1="0" x2="0.5" y2="1">
              <stop offset="0%" stopColor="#FFADF7"></stop>
              <stop offset="90%" stopColor="#FF9473"></stop>
            </linearGradient>
            <linearGradient id="linearColor3" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9473"></stop>
              <stop offset="100%" stopColor="#FF9473"></stop>
            </linearGradient>
            <linearGradient id="linearColor4" x1="1" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#FF9473"></stop>
              <stop offset="10%" stopColor="#F3FF69"></stop>
            </linearGradient>
            <linearGradient id="linearColor5" x1="0.5" y1="1" x2="0.5" y2="0">
              <stop offset="0%" stopColor="#F3FF69"></stop>
              <stop offset="30%" stopColor="#65FF3F"></stop>
            </linearGradient>
            <linearGradient id="linearColor6" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#65FF3F"></stop>
              <stop offset="50%" stopColor="#84BCFF"></stop>
            </linearGradient>
            <path
              d="M150 10 a60 60 0 0 1 51.9615 30"
              fill="none"
              stroke="url(#linearColor1)"
              strokeWidth="3"
              className="first"
              strokeLinecap="round"
            />
            <path
              d="M201.9615 40 a60 60 0 0 1 0 60"
              fill="none"
              stroke="url(#linearColor2)"
              strokeWidth="3"
              className="second"
              strokeLinecap="round"
            />
            <path
              d="M201.9615 100 a60 60 0 0 1 -51.9615 30"
              fill="none"
              stroke="url(#linearColor3)"
              strokeWidth="3"
              className="third"
              strokeLinecap="round"
            />
            <path
              d="M150 130 a60 60 0 0 1 -51.9615 -30"
              fill="none"
              stroke="url(#linearColor4)"
              strokeWidth="3"
              className="fourth"
              strokeLinecap="round"
            />
            <path
              d="M98.0385 100 a60 60 0 0 1 0 -60"
              fill="none"
              stroke="url(#linearColor5)"
              strokeWidth="3"
              className="fifth"
              strokeLinecap="round"
            />
            <path
              d="M98.0385 40 a60 60 0 0 1 51.9615 -30"
              fill="none"
              stroke="url(#linearColor6)"
              strokeWidth="3"
              className="sixth"
              strokeLinecap="round"
            />
          </svg>

          <svg id="shadow-loader">
            <path
              d="M150 10 a60 60 0 0 1 51.9615 30"
              fill="none"
              stroke="url(#linearColor1)"
              strokeWidth="9"
              className="first"
              strokeLinecap="round"
            />
            <path
              d="M201.9615 40 a60 60 0 0 1 0 60"
              fill="none"
              stroke="url(#linearColor2)"
              strokeWidth="9"
              className="second"
              strokeLinecap="round"
            />
            <path
              d="M201.9615 100 a60 60 0 0 1 -51.9615 30"
              fill="none"
              stroke="url(#linearColor3)"
              strokeWidth="9"
              className="third"
              strokeLinecap="round"
            />
            <path
              d="M150 130 a60 60 0 0 1 -51.9615 -30"
              fill="none"
              stroke="url(#linearColor4)"
              strokeWidth="9"
              className="fourth"
              strokeLinecap="round"
            />
            <path
              d="M98.0385 100 a60 60 0 0 1 0 -60"
              fill="none"
              stroke="url(#linearColor5)"
              strokeWidth="9"
              className="fifth"
              strokeLinecap="round"
            />
            <path
              d="M98.0385 40 a60 60 0 0 1 51.9615 -30"
              fill="none"
              stroke="url(#linearColor6)"
              strokeWidth="9"
              className="sixth"
              strokeLinecap="round"
            />
          </svg>
          <div className="loader-background"></div>

          <div className="progress-ball">
            <div className="rotate">
              <div className="inner"></div>
            </div>
          </div>

          <div className="percentage-container">
            <Text type="h2-small" color="b100">
              {t('onboarding_personalized_loader_percentage', {
                percentage,
              })}
            </Text>
          </div>
          <Text
            type="body"
            weight="semibold"
            color="b70"
            align="center"
            style={{ marginTop: '-34px' }}>
            {t('onboarding_personalized_loader_calculating')}
          </Text>
        </div>

        <div className="social-proof-container w-100">
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
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
