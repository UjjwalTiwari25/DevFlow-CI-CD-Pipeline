import React from 'react';
import Text from '../../app/Text';
import AwardWinnigApp from './AwardWinnigApp';
import ComplementaryCall from './ComplementaryCall';
import CustomRecommendations from './CustomRecommendations';
import DailyAccess from './DailyAccess';
import MoodTracking from './MoodTracking';
import SharedJournal from './SharedJournal';
import styles from './styles';

const PERSONALIZED_PLAN_ROW = [
  'dailyAccess',
  'customRecommendations',
  'moodTracking',
  'sharedJournal',
  'complementaryCall',
  'awardWinnigApp',
];
export default function PersonalizedPlan(props) {
  const COMPONENT_FOR_ROW = {
    dailyAccess: DailyAccess,
    customRecommendations: CustomRecommendations,
    moodTracking: MoodTracking,
    sharedJournal: SharedJournal,
    complementaryCall: ComplementaryCall,
    awardWinnigApp: AwardWinnigApp,
  };
  const { coach } = props;
  return (
    <div className={`main ${props.className}`}>
      <Text type="h4" weight="bold" color="b100">
        Your personalized plan has
      </Text>
      <Text type="body2" weight="normal" color="g50" style={{ marginTop: 5 }}>
        We analyzed all your responses and have put together the perfect mix of
        tracks.
      </Text>
      {PERSONALIZED_PLAN_ROW.map((key) => {
        const Component = COMPONENT_FOR_ROW[key];
        return <Component coach={coach} key={key} user={props.user} />;
      })}
      <style jsx>{styles}</style>
    </div>
  );
}
