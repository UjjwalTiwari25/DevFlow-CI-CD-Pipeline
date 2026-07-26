import React from 'react';
import Text from '../../../../app/Text';
import styles from './styles';

export default function CustomeRecomendations() {
  return (
    <div className="main">
      <div className="col align-center">
        <img
          src="/static/images/joinlist/cass.png"
          alt="aura coach cass"
          className="coach-image"
        />
        <Text type="body" color="b100" align="center" style={{ marginTop: 10 }}>
          Your Coach
        </Text>
      </div>
      <div>
        <img
          src="/static/images/joinlist/chat.png"
          alt="aura coach cass"
          className="chat"
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
