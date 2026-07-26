import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import ONBOARDING_COACHES from '../../../../data/onboardingCoaches.json';
import styles, { itemStyle } from './styles';

export default function TopCoaches({ className, style }) {
  const { t } = useTranslations();
  return (
    <div className={`card ${className}`} style={style}>
      <div className={`animation`}>
        <Text type="h3-large" weight="regular" color="b100" align="left">
          {t('onboarding_your_plan_top_coaches', { ns: 'yourplan' })}
        </Text>
        {
          <div
            className="coach-list"
            style={{
              display: 'inline-flex',
            }}>
            {ONBOARDING_COACHES.map((coach) => (
              <CoachItem coach={coach} key={coach.name} />
            ))}
          </div>
        }
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

function CoachItem({ coach }) {
  const { name, professionalTitle, country, picture, flag, subscribers } =
    coach;
  const { t } = useTranslations();
  return (
    <div className="coach-item-row">
      <img
        src={picture}
        alt={name}
        className="coach-image component-shadow-small"
      />
      <div className="coach-item-details">
        <Text type="h4" color="b100" weight="semibold" align="left">
          {t(name, { ns: 'yourplan' })}
        </Text>
        <Text type="footnote" color="b64" weight="regular" align="left">
          {t(professionalTitle, { ns: 'yourplan' })}
        </Text>
        <div className="row">
          <img className="flag-image" src={flag} alt={country} />
          <Text type="footnote" color="b64">
            {t(country, { ns: 'yourplan' })}
          </Text>
          <img
            className="subs-image"
            src="/static/images/icons/subscribers.png"
            alt={country}
          />
          <Text type="footnote" color="b64">
            {subscribers}
          </Text>
        </div>
      </div>
      <style jsx>{itemStyle}</style>
    </div>
  );
}
