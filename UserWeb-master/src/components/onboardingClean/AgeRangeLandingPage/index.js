import React, { useEffect } from 'react';
import useTranslations from '@/hooks/translations';
import { Icon } from '@aurahealth/web-design-system';
import config from '@/config';
import { getUrlLocale } from '@/models/locale';
import { Trans } from 'react-i18next';
import useBrowserHistory from '../../../hooks/browserHistory';
import Analytics from '../../../services/Analytics';
import OnboardingOptionButton from '../OnboardingOptionButton';
import styles from './styles.module.scss';

const AGE_RANGE_OPTIONS = [
  {
    title: 'onboarding_age_list_item_under_26',
    minAge: 0,
    maxAge: 25,
    group: 'a',
  },
  {
    title: 'onboarding_age_list_item_26_35',
    minAge: 26,
    maxAge: 35,
    group: 'b',
  },
  {
    title: 'onboarding_age_list_item_36_45',
    minAge: 36,
    maxAge: 45,
    group: 'c',
  },
  {
    title: 'onboarding_age_list_item_46_55',
    minAge: 46,
    maxAge: 55,
    group: 'd',
  },
  {
    title: 'onboarding_age_list_item_over_55',
    minAge: 56,
    maxAge: 120,
    group: 'e',
  },
];

export default function AgeRangeLandingPage({ onNext, onBack }) {
  useBrowserHistory('ageRangeLandingPage', true, onBack, onNext);

  useEffect(() => {
    Analytics.track('Sign Up Onboarding Screen Seen', { Screen: 'User Age' });
  }, []);

  const { t, currentLocale } = useTranslations();
  const onSelectItem = ({ minAge, maxAge, group }) => {
    Analytics.setSuperProperties({
      'Age Min': minAge,
      'Age Max': maxAge,
    });
    Analytics.setPeopleProperties({
      'Age Min': minAge,
      'Age Max': maxAge,
    });
    Analytics.track('Sign Up Onboarding Screen Completed', {
      Screen: 'User Age',
      Age: group,
      'Age Min': minAge,
      'Age Max': maxAge,
    });
    onNext({
      ageMin: minAge,
      ageMax: maxAge,
      ageGroup: group,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <img
          src="/static/images/logoVertical.png"
          alt="Aura"
          className={styles.auraLogo}
        />
        <div>
          <div className={styles.headingText}>
            {t('age_lp_title_take_first_step')}
          </div>
          <div key="grediant" className={styles.gradientHeadingText}>
            {t('age_lp_title_take_first_step_mindful_life')}
          </div>
          <div className={styles.minQuizText}> {t('age_lp_min_quiz')}</div>
        </div>
      </div>
      <div className={styles.itemContainer}>
        <div className={styles.howOldText}>{t('onboarding_age_how_old')}</div>
        {AGE_RANGE_OPTIONS.map((item) => (
          <OnboardingOptionButton
            dataTestId="onboardingAgeRange"
            title={t(item.title)}
            key={item.title}
            onClick={() => onSelectItem(item)}
            textStyle={{
              width: '90%',
              color: '#2F3237',
            }}
            className={styles.buttonWrapper}
            rigthIcon={
              <Icon name={Icon.LIST.ActionArrowRight} size={Icon.SIZES.extra} />
            }
          />
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.auraAddress}>
          <Trans
            ns="common"
            i18nKey="age_lp_aura_address"
            components={[<br key="break"></br>]}
          />
        </div>

        <div className={styles.footerItems}>
          <a
            href={`${config.appDomain}/${getUrlLocale(
              currentLocale
            )}terms-of-service`}>
            {t('age_lp_footer_terms')}
          </a>
          <a
            className="clickable"
            href={`${config.appDomain}/${getUrlLocale(
              currentLocale
            )}privacy-policy`}>
            {t('age_lp_footer_privacy')}
          </a>
          <a
            className="clickable"
            href={`${config.appDomain}/${getUrlLocale(currentLocale)}faq`}>
            {t('age_lp_footer_faq')}
          </a>
        </div>
      </div>
    </div>
  );
}
