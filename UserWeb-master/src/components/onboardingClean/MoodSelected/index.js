import React, { Fragment } from 'react';
import useTranslations from '@/hooks/translations';
import useBrowserHistory from '../../../hooks/browserHistory';
import OnboardingBigContinueButton from '../../app/OnboardingBigContinueButton';
import Text from '../../app/Text';
import Header from '../Header';
import styles from './styles';

const MOOD_SELECTION_HEADERS = {
  sad: {
    title: 'onboarding_mood_selected_sad_all_have_moments',
    subtitle: 'onboarding_mood_selected_sad_what_matters',
  },
  stressed: {
    title: 'onboarding_mood_selected_stressed_feel_like_that',
    subtitle: 'onboarding_mood_selected_stressed_your_objective',
  },
  anxious: {
    title: 'onboarding_mood_selected_anxious_have_anxiety',
    subtitle: 'onboarding_mood_selected_anxious_through_meditation',
  },
  happy: {
    title: 'onboarding_mood_selected_happy_thats_wonderful',
    subtitle: 'onboarding_mood_selected_happy_train_yourself',
  },
  sleepy: {
    title: 'onboarding_mood_selected_sleepy_mediation_is_a_great_way',
  },
  confused: {
    title: 'onboarding_mood_selected_confused_will_help_you',
  },
  angry: {
    title: 'onboarding_mood_selected_angry_bottling_anger',
    subtitle: 'onboarding_mood_selected_angry_meditation_helps',
  },
  afraid: {
    title: 'onboarding_mood_selected_afraid_fear',
    subtitle: 'onboarding_mood_selected_afraid_practice_meditation',
  },
};

export default function MoodSelected({ onBack, onNext, profile, experiments }) {
  useBrowserHistory('moodSelected', true, onBack, onNext);
  const { t } = useTranslations();
  const { mood = 'sleepy' } = profile;

  return (
    <Fragment>
      <Header
        title={t(MOOD_SELECTION_HEADERS[mood]?.title)}
        subtitle={t(MOOD_SELECTION_HEADERS[mood]?.subtitle)}
        experiments={experiments}></Header>
      <div className="item-container">
        <img
          className="mood-image"
          src="/static/images/icons/new_morning_sun.png"
          alt="Morning Sun"
        />
        <Text
          type="body2"
          weight="regular"
          color="b100"
          align="left"
          style={{
            marginLeft: 36,
            width: '80%',
          }}>
          {t('onboarding_mood_selected_with_aura')}
        </Text>
      </div>
      <OnboardingBigContinueButton
        title={t('button_continue')}
        experiments={experiments}
        onClick={() => onNext()}
      />
      <style jsx>{styles}</style>
    </Fragment>
  );
}
