import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import Header from '../../Header';
import useBrowserHistory from '../../../../hooks/browserHistory';
import styles from './styles';
import OnboardingBigContinueButton from '../../../app/OnboardingBigContinueButton';
import Text from '../../../app/Text';

const QUESTION_LIST_EXP = [
  {
    icon: '/static/images/clock.png',
    text: 'onboarding_educational_sleep_screens_list_item_one',
  },
  {
    icon: '/static/images/music.png',
    text: `onboarding_educational_sleep_screens_list_item_two`,
  },
];

export default function SleepEducationalQuestion({
  onNext,
  onBack,
  experiments,
}) {
  useBrowserHistory('sleepEducationalQuestion', true, onBack, onNext);
  const { t } = useTranslations();

  const questionList = QUESTION_LIST_EXP;

  function onSubmit() {
    onNext();
  }

  return (
    <Fragment>
      <div className="header-container">
        <Header
          experiments={experiments}
          title={t('onboarding_educational_sleep_screens_header')}
        />
      </div>
      <div className="item-container">
        <div className="background" />

        <div
          className="graph-container"
          style={{
            marginBottom: 0,
          }}>
          <img
            src="/static/images/sleepQuestion.svg"
            alt="sleep-question"
            className="graph"
          />
        </div>
      </div>
      <Text
        type="body"
        color="b100"
        align="left"
        style={{
          lineHeight: '18px',
          marginTop: '30px',
        }}>
        {t('onboarding_educational_sleep_screens_subtitle')}
      </Text>
      <div className="aura-help-text">
        <div className="aura-help-text">
          {questionList &&
            questionList.map((item, index) => (
              <div key={index} className="list-container2">
                <div>
                  <div className="icon-container">
                    <img src={item.icon} alt="icon" className="icon" />
                  </div>
                </div>
                <Text type="body2" color="b64" style={{ lineHeight: '18px' }}>
                  {t(item.text)}
                </Text>
              </div>
            ))}
        </div>
      </div>
      <div className="button">
        <OnboardingBigContinueButton
          title={t('button_continue')}
          experiments={experiments}
          onClick={() => {
            onSubmit();
          }}
        />
      </div>
      <style jsx>{styles}</style>
    </Fragment>
  );
}
