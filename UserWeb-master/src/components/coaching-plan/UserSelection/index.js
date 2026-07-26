import React from 'react';
import PersonalizedContent from '../../yourPlan/clean/PersonalizedContent';
import PersonalizedContentDuration from '../../yourPlan/clean/PersonalizedContentDuration';
import PersonalizedPreferences from '../../yourPlan/clean/PersonalizedPreferences';
import TherapistsCounter from '../TherapistsCounter';
import styles from './styles';

const PERSONALIZED_PLAN_ROW = [
  'personalizedPreferences',
  'personalizedContent',
  'personalizedContentDuration',
];

export default function UserSelection(props) {
  const COMPONENT_FOR_ROW = {
    personalizedPreferences: PersonalizedPreferences,
    personalizedContent: PersonalizedContent,
    personalizedContentDuration: PersonalizedContentDuration,
  };
  return (
    <div className={`main ${props.className}`}>
      <TherapistsCounter isCoachPlan={true} {...props} />
      <div className="line-container">
        <img src="/static/images/line.png" alt="line" />
      </div>
      {PERSONALIZED_PLAN_ROW.map((key) => {
        const Component = COMPONENT_FOR_ROW[key];
        return <Component isCoachPlan={true} key={key} {...props} />;
      })}
      <style jsx>{styles}</style>
    </div>
  );
}
