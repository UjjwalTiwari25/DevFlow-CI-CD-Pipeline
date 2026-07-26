import classNames from 'classnames';
import React from 'react';
import useTranslations from '@/hooks/translations';
import Text from '../../../app/Text';
import styles from './styles';

const BENEFITS_TEXT = [
  {
    description: 'payment_subscribe_benefits_aura_understands',
  },
  {
    description: 'payment_subscribe_benefits_fall_asleep',
    descriptionChakraExp: 'payment_subscribe_benefits_fall_asleep_chakra_exp',
  },
  {
    description: 'payment_subscribe_benefits_access_1000_meditations',
  },
];

export default function Benefits({
  className,
  isShareReferral,
  isBlinklistStyle,
}) {
  const { t } = useTranslations();

  return (
    <div
      className={classNames(`${className} card-normal less-padding`, {
        'challenge-values-card': isShareReferral,
      })}
      style={{
        paddingBottom: isBlinklistStyle && '5px',
        marginTop: isBlinklistStyle && '10px',
      }}>
      <div
        className={classNames('values-wrapper', {
          'challenge-values-wrapper': isShareReferral,
        })}>
        {BENEFITS_TEXT.map((item, index) => (
          <div
            className={classNames('value-contanier', {
              'challenge-value-contanier': isShareReferral,
            })}
            key={index}>
            <img
              src="/static/images/icons/blueCheck.png"
              alt="benefit icons"
              className="blue-check"
            />
            <Text
              type="body"
              align="left"
              weight="normal"
              color="b64"
              style={{ lineHeight: '19px' }}>
              {t(
                item.descriptionChakraExp
                  ? item.descriptionChakraExp
                  : item.description,
                { ns: 'subscribe' }
              )}
            </Text>
          </div>
        ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
