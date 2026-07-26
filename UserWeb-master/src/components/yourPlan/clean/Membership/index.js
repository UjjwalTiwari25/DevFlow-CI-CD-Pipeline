import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import useThemeListener from '../../../../hooks/themeListener';
import Text from '../../../app/Text';
import styles from './styles';

const MEMBERSHIP_VALUE_TEXT = [
  {
    description: 'onboarding_your_plan_understand_your_emotions',
    image: '/static/images/icons/union.png',
  },
  {
    description: 'onboarding_your_plan_fall_asleep',
    image: '/static/images/membership/infinity.png',
  },
  {
    description: 'onboarding_your_plan_unlimited_access',
    image: '/static/images/membership/infinity.png',
  },
  {
    description: 'onboarding_your_plan_exclusive_content',
    descriptionChakraExp: 'onboarding_your_plan_exclusive_content_chakra_exp',
    image: '/static/images/membership/exclusive.png',
  },
  {
    description: 'onboarding_your_plan_new_content',
    image: '/static/images/membership/new-content.png',
  },
  {
    description: 'onboarding_your_plan_download_content',
    image: '/static/images/membership/download-button.png',
  },
];

export default function Membership({ className, experiments }) {
  const { isDark } = useThemeListener();
  const { t, currentLocale } = useTranslations();
  return (
    <>
      <div className={classNames(`card padding-normal ${className} animation`)}>
        <div>
          <Text
            type="h3-large"
            weight="regular"
            color="b100"
            align="left"
            style={{ width: 310 }}>
            {t('onboarding_your_plan_included_in_membership', {
              ns: 'yourplan',
            })}
          </Text>
          <div className="values-wrapper">
            {MEMBERSHIP_VALUE_TEXT.map((item, index) => (
              <div className="value-contanier" key={index}>
                <div>
                  <img
                    src={item.image}
                    alt="blue-check"
                    className="blue-check"
                  />
                </div>
                <Text
                  type="body2"
                  align="left"
                  weight={'normal'}
                  color={isDark ? 'b100' : 'g100'}
                  style={{ lineHeight: '18px' }}>
                  {t(
                    item.descriptionChakraExp
                      ? item.descriptionChakraExp
                      : item.description,
                    { ns: 'yourplan' }
                  )}
                </Text>
              </div>
            ))}
          </div>
          {experiments?.noTrial3SKUs !== 'c' && (
            <div className="social-proof-container">
              <img
                src={getLocaleImage(
                  '/static/images/best-of-apps-winner.png',
                  currentLocale
                )}
                alt="best of apps"
                style={{ width: '87px', height: '64px', marginRight: '16px' }}
                className="social-proof"
              />
              <img
                src={getLocaleImage(
                  '/static/images/award-2023-winner.png',
                  currentLocale
                )}
                alt="award winner"
                style={{ width: '92px', height: '62px' }}
                className="social-proof"
              />
            </div>
          )}
        </div>
        <style jsx>{styles}</style>
      </div>
    </>
  );
}
