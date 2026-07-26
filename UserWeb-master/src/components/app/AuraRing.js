import React from 'react';

const DEFAULT_SIZE = 72;

export default function AuraRing({ style, size }) {
  return (
    <img
      src="/static/images/icons/auraLogo.png"
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
