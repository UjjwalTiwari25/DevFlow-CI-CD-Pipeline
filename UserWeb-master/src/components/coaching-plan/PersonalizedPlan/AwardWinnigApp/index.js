import React from 'react';
import Text from '../../../app/Text';
import styles from './styles';

export default function AwardWinnigApp() {
  return (
    <div className={`main`}>
      <Text type="h4" weight="normal" color="b100" style={{ maxWidth: 230 }}>
        6. Full access to Apple award-winning Aura app
      </Text>
      <img
        src="/static/images/coachplan/winningapp.png"
        alt="app"
        width="100%"
      />
      <style jsx>{styles}</style>
    </div>
  );
}
