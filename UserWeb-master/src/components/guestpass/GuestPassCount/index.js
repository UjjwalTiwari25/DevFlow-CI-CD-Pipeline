import React from 'react';
import Text from '../../app/Text';
import styles from './styles';

export default function GuestPassCount({ invites = 0, referrals = 0, style }) {
  return (
    <div id="count-container" style={style}>
      <GuestPassCountItem label="Started Guest Pass" value={invites} />
      <div className="divider" />
      <GuestPassCountItem label="Your Referral Count" value={referrals} />
      <style jsx>{styles}</style>
    </div>
  );
}

function GuestPassCountItem({ label, value }) {
  return (
    <div>
      <Text type="h4" color="b100" align="center">
        {label}
      </Text>
      <Text type="h2" color="b100" align="center">
        {value}
      </Text>
    </div>
  );
}
