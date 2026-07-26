import React from 'react';
import styles from './styles';
import Text from '../Text';

export default function Error({ message, style }) {
  return (
    <div className="error-container" style={style}>
      <Text type="h4" color="b100" align="center">
        {message || 'Sorry, we could not find the page you requested'}
      </Text>
      <style jsx>{styles}</style>
    </div>
  );
}
