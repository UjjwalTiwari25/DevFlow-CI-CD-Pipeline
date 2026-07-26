import React from 'react';
import Text from '../../app/Text';
import styles from './styles';

export default function Post({ post }) {
  const { user = {}, content, title } = post;
  const { firstName = '' } = user;
  // Obtain all /g the alphanumeric characters \w
  // that occur after a non-alphanumeric character
  // (i.e: after a word boundary \b), put them on
  // an array with .match(), splice first two and
  // join everything in a single string .join('')
  const cleanFirstName = firstName.match(/\b(\w)/g);
  const avatarContent = cleanFirstName
    ? cleanFirstName.splice(0, 2).join('')
    : '';
  return (
    <div className="root">
      <div style={{ margin: '10px' }}>
        <div style={{ display: 'inline-flex' }}>
          <div className="avatar-small">
            <Text
              color="w100"
              type="body"
              weight="regular"
              style={{
                marginTop: '4px',
              }}>
              {avatarContent}
            </Text>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              color="b100"
              type="body"
              weight="regular"
              style={{
                marginLeft: '10px',
              }}>
              {firstName}
            </Text>
          </div>
        </div>
        <div className="post-content">
          <Text color="b80" type="body2" weight="regular">
            {title}
          </Text>
          <Text color="b80" type="body2" weight="regular">
            {content}
          </Text>
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
