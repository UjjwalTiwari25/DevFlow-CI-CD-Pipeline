import React, { useState } from 'react';
import Text from './Text';
import useHydration from '../../hooks/hydration';

export default function ClippedText({
  text,
  type,
  weight,
  color,
  align,
  style,
  ...props
}) {
  const [clippedText, setClippedText] = useState(true);
  const isClient = useHydration();

  if (!isClient) {
    return null;
  }

  if (clippedText) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'flex-end' }}>
        <Text
          type={type}
          color={color}
          weight={weight}
          align={align}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            marginBottom: 8,
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            ...style,
          }}
          {...props}></Text>
        {props.children && (
          <div className="clickable" style={{ marginBottom: 8 }}>
            <Text
              type={type}
              color={color}
              weight={weight}
              align={align}
              style={style}
              onClick={() => setClippedText(!clippedText)}>
              more
            </Text>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Text
        type={type}
        weight={weight}
        color={color}
        align={align}
        style={style}
        {...props}></Text>
    </div>
  );
}
