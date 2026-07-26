import React from 'react';

export default function Text({
  component,
  type,
  color,
  weight,
  align,
  ...props
}) {
  const Component = component || 'div';
  return (
    <Component
      className={`font custom-font ${type} ${color} ${weight} ${align}`}
      {...props}
    />
  );
}
