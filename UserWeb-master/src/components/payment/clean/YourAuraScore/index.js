import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { getLocaleImage } from '@/models/locale';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

export default function YourAuraScore({
  yourScore,
  isUsedOnYourPlan,
  className,
}) {
  const { isDark } = useThemeListener();
  const { t, currentLocale } = useTranslations();

  return (
    <div
      className={classNames('aura-score-card', className, {
        'low-opacity': isDark,
        'less-margin': isUsedOnYourPlan,
      })}>
      <div className="header">
        <Text
          type="h4-large"
          color={isDark ? 'b100' : 'g100'}
          align="center"
          weight="semibold"
          style={{ marginBottom: 14, lineHeight: '24px' }}>
          {t('payment_subscribe_aura_score_your_score', {
            score: I18NFormatter.formatNumber(yourScore),
          })}
        </Text>
        <Text
          type="footnote"
          color={isDark ? 'b100' : 'g100'}
          align="center"
          weight="semibold"
          style={{ lineHeight: '15px' }}>
          {t('payment_subscribe_aura_score_based_on')}
        </Text>
        <div className="based-on-section">
          <div className="based-on-value">
            <div className="custom-font wellness-text based-on-text">
              {t('payment_subscribe_aura_score_mental_wellness')}
            </div>
            <img
              src={'/static/images/wellnessCircle.png'}
              alt="Wellness"
              className={'dot-icon'}
            />
          </div>
          <div className="based-on-value">
            <div className="custom-font sleep-text based-on-text">
              {t('payment_subscribe_aura_score_sleep')}
            </div>
            <img
              src={'/static/images/sleepCircle.png'}
              alt="Sleep"
              className={'dot-icon'}
            />
          </div>
          <div className="based-on-value">
            <div className=" custom-font interest-text based-on-text">
              {t('payment_subscribe_aura_score_interests')}
            </div>
            <img
              src={'/static/images/interestCircle.png'}
              alt="Interest"
              className={'dot-icon'}
            />
          </div>
        </div>
      </div>
      <div className="graph-container">
        {yourScore < 85 && (
          <>
            <img
              src={getLocaleImage(
                '/static/images/graphs/auraLowScoreGraph.png',
                currentLocale
              )}
              alt=""
              className="graph"
            />
            <Text
              type="h4"
              color="b100"
              style={{
                position: 'absolute',
                bottom: '35%',
                left: '11.5%',
              }}>
              {yourScore}
            </Text>
          </>
        )}
        {yourScore >= 85 && (
          <>
            <img
              src={getLocaleImage(
                '/static/images/graphs/auraHighScoreGraph.png',
                currentLocale
              )}
              alt="aura-graph"
              className="graph"
            />
            <Text
              type="body2"
              color="b100"
              style={{
                position: 'absolute',
                bottom: '48%',
                left: '10.5%',
              }}>
              {yourScore}
            </Text>
          </>
        )}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
