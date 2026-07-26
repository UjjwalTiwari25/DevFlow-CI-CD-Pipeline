import React, { useState } from 'react';
import Text from '../../app/Text';
import styles from './styles';

function LiveUserInfo({ info }) {
  const [isImageAvailable, setIsImageAvailable] = useState(true);
  const { picture, givenName } = info;

  if (picture && isImageAvailable) {
    return (
      <>
        <img
          src={picture}
          alt="aura"
          className="user-image"
          onError={() => setIsImageAvailable(false)}
        />
        <style jsx>{styles}</style>
      </>
    );
  }
  const firstLetter = givenName && givenName.charAt(0);
  return (
    <Text type="footnote" color="g50">
      {firstLetter}
    </Text>
  );
}

export default LiveUserInfo;
