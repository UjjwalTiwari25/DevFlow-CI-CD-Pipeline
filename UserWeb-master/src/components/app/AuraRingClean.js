import React from 'react';

const DEFAULT_SIZE = 76;

export default function AuraRingClean({ style, size }) {
  return (
    <img
      src="/static/images/icons/auraRingClean.webp"
      alt="Aura Logo"
      style={{
        width: size || DEFAULT_SIZE,
        height: size || DEFAULT_SIZE,
        objectFit: 'contain',
        ...style,
      }}
    />
  );
}
