import React from 'react';
import AuraRing from '../AuraRing';
import styles from './styles';

export default function AuraLoader({ size }) {
  return (
    <div
      className="rotate-ring"
      style={{
        width: size,
        height: size,
      }}>
      <AuraRing size={size} />
      <style jsx>{styles}</style>
    </div>
  );
}
