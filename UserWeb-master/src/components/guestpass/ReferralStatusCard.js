import React from 'react';
import referralConstants from '../../utils/constants/referral';
import Text from '../app/Text';

export default function ReferralStatusCard({
  referrals = [],
  referralFriends = {},
}) {
  return (
    <div>
      <ReferralStatusItem
        name="Name"
        status="Status"
        displayStatus="Status"
        date="Date"
        isHeader
      />
      <div style={{ height: 12 }} />
      {referrals.length ? (
        referrals.map((referral) => {
          const { referree, status, statusAt } = referral;
          const referralFriend = referralFriends[referree];
          if (!referralFriend) {
            return null;
          }
          const statusDate = new Date(statusAt);
          const displayDate = `${
            statusDate.getMonth() + 1
          }/${statusDate.getDate()}/${statusDate.getFullYear()}`;
          return (
            <ReferralStatusItem
              key={referral.id}
              name={referralFriend.givenName}
              displayStatus={referralConstants.GUESTPASS_DISPLAY_STATUS[status]}
              status={status}
              date={displayDate}
            />
          );
        })
      ) : (
        <Text type="body" color="b100" style={{ marginLeft: 24 }}>
          {`You don't have any referrals yet.`}
        </Text>
      )}
    </div>
  );
}

function ReferralStatusItem({ name, status, displayStatus, date, isHeader }) {
  const textStyle = isHeader ? 'h4' : 'body';
  const isCredited = status === referralConstants.STATUS_CREDITED;
  return (
    <div
      className="row"
      style={{
        opacity: status === referralConstants.STATUS_CANCELLED ? 0.5 : 1,
        marginBottom: 12,
        maxWidth: 640,
      }}>
      <div style={{ width: 16, height: 16, marginRight: 8, marginTop: 4 }}>
        {isCredited && (
          <img
            src={isCredited ? '/static/images/icons/blueCheck.png' : null}
            style={{ width: 16, height: 16, objectFit: 'contain' }}
            alt="Completed"
          />
        )}
      </div>
      <Text type={textStyle} color="b100" style={{ flex: 0.25 }}>
        {name}
      </Text>
      <Text
        type={textStyle}
        color={isCredited ? 'cta-blue' : 'b100'}
        style={{ flex: 0.4 }}>
        {displayStatus}
      </Text>
      <Text
        type={textStyle}
        color={isCredited ? 'cta-blue' : 'b100'}
        style={{ flex: 0.3, marginLeft: 16 }}>
        {date}
      </Text>
    </div>
  );
}
