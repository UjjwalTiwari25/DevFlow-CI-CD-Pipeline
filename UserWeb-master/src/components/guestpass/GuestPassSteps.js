import React from 'react';
import Text from '../app/Text';

const STEPS = [
  'Share 30-Day Guest Pass',
  'Earn Rewards',
  'Donate free subscriptions to charity',
];

export default function GuestPassSteps() {
  return (
    <div className="row">
      {STEPS.map((step, index) => (
        <GuestPassStep index={index} text={step} key={step} />
      ))}
    </div>
  );
}

function GuestPassStep({ index, text }) {
  return (
    <div className="row align-center" style={{ marginRight: 16 }}>
      <Text
        type="subtitle"
        align="center"
        style={{
          borderWidth: 2,
          borderRadius: 32,
          borderColor: '#999',
          borderStyle: 'solid',
          padding: '4px 8px',
          marginRight: 8,
        }}>
        {index + 1}
      </Text>
      <Text type="h4">{text}</Text>
    </div>
  );
}
