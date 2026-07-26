import classNames from 'classnames';
import { ButtonCenter } from '@aurahealth/web-design-system';
import React, { useState } from 'react';
import Loader from '@/components/app/Loader';
import useTranslations from '@/hooks/translations';
import useConvertPriceInLocalCurrency from '@/hooks/useConvertPriceInLocalCurrency';
import useBrowserHistory from '../../../hooks/browserHistory';
import AuraRingClean from '../../app/AuraRingClean';
import Text from '../../app/Text';
import styles from './styles';
import useThemeListener from '../../../hooks/themeListener';

export default function ChooseYourFee({ onBack, onNext, setFee, experiments }) {
  const { formatLocalPricing } = useConvertPriceInLocalCurrency({
    experiments,
  });

  useBrowserHistory('chooseYourFee', true, onBack, onNext);
  const { t } = useTranslations();
  const values = ['0', '0.99', '2.99'];

  const popularValue = '2.99';
  const [currentSelectedFee, setCurrentSelectedFee] = useState(popularValue);

  const { isDark } = useThemeListener();

  function onSubmit(value) {
    setCurrentSelectedFee(value);
  }

  function onSkip() {
    setFee('0');
    onNext();
  }

  return (
    <>
      {!experiments ? (
        <Loader />
      ) : (
        <div className="wrapper-main">
          <div
            className={classNames('wrapper', 'wrapper-exp-trial-fee-screen')}>
            <AuraRingClean />

            <div className="choose-fee">
              <Text type={'h3'} color="b100" align="center">
                {t('payment_choose_your_fee_choose_fee')}
              </Text>
            </div>
            <Text type="body" color={isDark ? 'b64' : 'g100'} align="center">
              {t('payment_choose_your_fee_money_get_in_way')}
            </Text>
            <Text
              type={'h4-large'}
              color="b100"
              align="center"
              style={{
                marginTop: 72,
              }}>
              {t('payment_choose_your_fee_choose_a_price')}
            </Text>

            <div
              className={classNames(
                'value-wrapper-exp value-wrapper value-wrapper-exp-trial-fee-screen'
              )}>
              {values.map((value) => (
                <div key={value} className="single-value-container">
                  <div
                    className={classNames('background-grey', {
                      'background-white': isDark,
                    })}>
                    <div
                      onClick={() => {
                        onSubmit(value);
                      }}
                      className={classNames('value-short', {
                        border: value === popularValue,
                        'border-white': value === currentSelectedFee,
                      })}
                      data-testid={`${value}`}>
                      <div className="col align-center">
                        <Text
                          type="h4"
                          weight="semibold"
                          color="b100"
                          align="center">
                          {formatLocalPricing(value)}
                        </Text>
                      </div>
                    </div>
                  </div>
                  {value === popularValue && (
                    <div className="most-popular">
                      <Text
                        type="footnote"
                        color={isDark ? 'b100' : 'w100'}
                        weight="semibold"
                        style={{
                          fontSize: '10px',
                          marginTop: 1,
                        }}>
                        {t('payment_choose_your_fee_most_common')}
                      </Text>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Text
              type={'body'}
              color={isDark ? 'b64' : 'g100'}
              align="center"
              style={{
                maxWidth: '100%',
                marginTop: 16,
              }}>
              {t('payment_choose_your_fee_directly_supports')}
            </Text>

            <div className="button-wrapper">
              <ButtonCenter
                data-testid="continueWithTrialFee"
                text={t('payment_choose_your_fee_trial_fee', {
                  trialFee: formatLocalPricing(currentSelectedFee),
                })}
                disable={!currentSelectedFee}
                onClick={() => {
                  setFee(currentSelectedFee);
                  onNext();
                }}
                height="large"
                type="primary"
                style={{
                  borderRadius: '9999px',
                  background: '#FFF',
                  boxShadow: '0px 12px 40px 0px rgba(43, 42, 107, 0.20)',
                  fontSize: '18px',
                  lineHeight: '24px',
                  textShadow: '0px 0px 0px',
                }}
              />

              <div onClick={onSkip} className="clickable">
                <Text type="body" color="b100" weight="semibold">
                  {t('payment_choose_your_fee_skip_trial')}
                </Text>
              </div>
            </div>
          </div>

          <style jsx>{styles}</style>
        </div>
      )}
    </>
  );
}
