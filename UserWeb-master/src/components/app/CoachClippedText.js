import React, { useState } from 'react';
import Text from './Text';
import useHydration from '../../hooks/hydration';

export default function CoachClippedText({
  text,
  type,
  weight,
  color,
  align,
  style,
  fullBioColor,
  isMobile,
  ...props
}) {
  const [clippedText, setClippedText] = useState(true);
  const isClient = useHydration();

  if (!isClient) {
    return null;
  }

  if (clippedText) {
    return (
      <div style={{ display: 'block', marginBottom: !isMobile && 30 }}>
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
            WebkitLineClamp: isMobile ? 3 : 5,
            WebkitBoxOrient: 'vertical',
            ...style,
          }}
          {...props}></Text>
        {props.children && !isMobile && (
          <div className="clickable">
            <Text
              type={type}
              weight={weight}
              align={align}
              style={{ textDecoration: 'underline', color: '#9092A3' }}
              onClick={() => setClippedText(!clippedText)}>
              Full bio
            </Text>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 30 }}>
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
