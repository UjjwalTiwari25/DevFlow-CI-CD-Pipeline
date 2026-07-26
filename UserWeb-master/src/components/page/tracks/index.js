import React from 'react';
import Link from 'next/link';
import routeConstants from '@/utils/constants/routes';
import Text from '@/components/app/Text';
import { BiPlayCircle } from 'react-icons/bi';
import styles from './styles';

export default function TracksPage({ meditationsTracks }) {
  return (
    <div className="main-wrapper">
      <div>
        <Text
          type="h2"
          component="h1"
          color="b100"
          style={{ marginTop: 24, marginBottom: 24 }}>
          Tracks
        </Text>
      </div>
      <div className="container">
        {meditationsTracks?.map((item) => (
          <Link
            key={item.title}
            href={`/${routeConstants.PAGE_TRACK}/${item.slug}`}
            legacyBehavior>
            <a>
              <div className="music-tracks">
                <div className="content">
                  <div className="titles">
                    <Text
                      color="b100"
                      type="h4"
                      weight="semibold"
                      style={{
                        width: '150px',
                        overflow: 'hidden',
                        display: 'inline-block',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                      {item.title}
                    </Text>
                    <Text type="body2" color="b64">
                      {item.source}
                    </Text>
                  </div>
                  <BiPlayCircle size={30} />
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
