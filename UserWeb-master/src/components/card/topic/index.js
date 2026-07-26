import React from 'react';
import Link from 'next/link';
import Text from '../../app/Text';
import routeConstants from '../../../utils/constants/routes';
import contentConstants from '../../../utils/constants/content';
import styles from './styles';

export default function Topic({ topic }) {
  if (!topic || !topic.title) {
    return null;
  }
  const { title, photoUrl, fullImage, type, urlKey, slug } = topic;
  let path = `/${routeConstants.PAGE_TOPICS}/${slug}`;
  if (type === contentConstants.CONTENT_UI_TYPES.CONTENT_TYPE) {
    path = `/${urlKey}`;
  }

  return (
    <div className="wrapper">
      <img
        src={`${photoUrl || fullImage || '/static/images/auraPic.jpg'}`}
        alt="background"
        className="blur-background"
      />
      <div className="root">
        <Link href={path} legacyBehavior>
          <a
            className="content-item-container clickable"
            style={{
              backgroundImage: `linear-gradient(transparent, #0008),
            url(${photoUrl || fullImage || '/static/images/auraPic.jpg'})`,
            }}>
            <Text
              type="cta"
              color="w100"
              weight="bold"
              align="center"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                marginBottom: 8,
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}>
              {title || ''}
            </Text>
          </a>
        </Link>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
