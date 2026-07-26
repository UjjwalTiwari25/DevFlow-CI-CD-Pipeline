import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Text from '../../app/Text';
import styles from './styles';

export default function ContentType({ data, isClickable = true }) {
  const path = `/${data.urlKey}`;
  const Component = isClickable ? Link : 'span';
  return (
    <div className="wrapper">
      <img
        src={`${data.fullImage}`}
        alt="background"
        className="blur-background"
      />
      <div className="root">
        <Component
          href={path}
          className={`aura-item-container ${isClickable && 'clickable'}`}
          style={{
            backgroundImage: `linear-gradient(transparent, #0008),
          url(${data.fullImage})`,
          }}>
          {!!data.minimalIcon && (
            <Image
              src={data.minimalIcon}
              alt={data.title}
              style={{ objectFit: 'contain', marginBottom: '10px' }}
              width={20}
              height={20}
            />
          )}
          <Text
            type="cta"
            color="w100"
            weight="bold"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              marginBottom: 8,
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
            {data.title}
          </Text>
        </Component>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
