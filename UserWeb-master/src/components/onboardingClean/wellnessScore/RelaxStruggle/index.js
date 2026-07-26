import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import Analytics from '../../../../services/Analytics';
import styles from './styles';
import Text from '../../../app/Text';
import useThemeListener from '../../../../hooks/themeListener';

const OPTIONS = [
  {
    title: `1`,
    itemKey: `1`,
    score: 0,
  },
  {
    title: `2`,
    itemKey: `2`,
    score: -1,
  },
  {
    title: `3`,
    itemKey: `3`,
    score: -2,
  },
  {
    title: `4`,
    itemKey: `4`,
    score: -3,
  },
  {
    title: `5`,
    itemKey: `5`,
    score: -4,
  },
];

export default function RelaxStruggle({
  onNext,
  onBack,
  profile,
  experiments,
}) {
  useBrowserHistory('relaxStruggle', true, onBack, onNext);
  const { isDark } = useThemeListener();
  const { t } = useTranslations();

  const onSelectItem = ({ itemKey, score }) => {
    Analytics.track(`Relax Struggle Event`, {
      Time: new Date().toTimeString().slice(0, 2),
      Day: new Date().getDay(),
      'Relax Struggle Key': itemKey,
    });
    Analytics.setPeopleProperties({
      'Relax Struggle Key': itemKey,
    });

    onNext({
      onboardingWellnessScore: {
        ...(profile.onboardingWellnessScore || {}),
        relaxStruggle: {
          itemKey,
          score,
        },
      },
    });
  };

  return (
    <Fragment>
      <Header
        title={t('onboarding_relax_struggle_header')}
        subtitle={`“${t('onboarding_relax_struggle_subtitle')}”`}
        experiments={experiments}
      />
      <div className="item-container">
        {OPTIONS.map((item) => (
          <div
            className="item"
            onClick={() => {
              onSelectItem(item);
            }}
            key={item.itemKey}>
            <Text type="h4" color="g100">
              {item.title}
            </Text>
          </div>
        ))}
      </div>
      <div className="text-container">
        <Text type="footnote" color={isDark ? 'b100' : 'g100'}>
          {t('onboarding_relax_struggle_strongly_disagree')}
        </Text>
        <Text type="footnote" color={isDark ? 'b100' : 'g100'}>
          {t('onboarding_relax_struggle_strongly_agree')}
        </Text>
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
