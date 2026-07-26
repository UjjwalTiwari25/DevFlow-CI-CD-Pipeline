import React, { Fragment } from 'react';
import useBrowserHistory from '../../hooks/browserHistory';
import AuraButton from '../app/AuraButton';
import Text from '../app/Text';
import Header from './Header';

const MEDITATION_SELECTION_HEADERS = {
  never_tried_it: `Everybody has to start somewhere! There's nothing to be intimidated by.`,
  tried_few_times: `That's great news!`,
  love_it: 'We love a challenge!',
};
const MEDITATION_SELECTION_TEXT = {
  never_tried_it:
    '87% of our users report Aura helps improving wellbeing and sleep in just 3 days!',
  tried_few_times:
    'New content is added weekly so your practice never gets boring.',
  love_it: 'New content is added weekly so the app grows with you.',
};

export default function MeditationLevelSelected({ onBack, onNext, profile }) {
  useBrowserHistory('meditationLevelSelected', true, onBack, onNext);
  const { onboardingMeditationLevel } = profile;
  return (
    <Fragment>
      <Header title={MEDITATION_SELECTION_HEADERS[onboardingMeditationLevel]} />
      <div className="item-container">
        {onboardingMeditationLevel !== 'never_tried_it' && (
          <Text
            type="subtitle"
            weight="regular"
            color="b64"
            align="center"
            style={{
              width: '100%',
              marginTop: 34,
            }}>
            With Aura, you get exclusive content from top mindfulness experts,
            psychologists, and therapists.
          </Text>
        )}
        <Text
          type="subtitle"
          weight="regular"
          color="b64"
          align="center"
          style={{
            width: '100%',
            marginTop: 50,
            marginBottom: 80,
          }}>
          {MEDITATION_SELECTION_TEXT[onboardingMeditationLevel]}
        </Text>
      </div>
      <AuraButton
        title="Continue"
        style={{ minWidth: 210, position: 'fixed', bottom: 24 }}
        onClick={() => onNext()}
      />
      <style jsx>{`
        .item-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 66px;
        }
      `}</style>
    </Fragment>
  );
}
