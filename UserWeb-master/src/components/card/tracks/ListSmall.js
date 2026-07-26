import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Text from '../../app/Text';
import {
  getMeditationDisplayDuration,
  getMeditationPhoto,
} from '../../../models/meditation';
import routeConstants from '../../../utils/constants/routes';
import { generateQueryPath, getCountDisplayValue } from '../../../utils';
import usePageQuery from '../../../hooks/pageQuery';

export default function ListSmall({ track }) {
  const {
    utm_source = null,
    userId = null,
    utm_campaign = null,
  } = usePageQuery();
  const router = useRouter();
  const { duration, duration7, favoritedCount } = track;
  const photoUrl = getMeditationPhoto(track, 'photo100Url');
  const subText1 = duration
    ? `${getMeditationDisplayDuration(duration)} min`
    : null;
  const subText2 = duration7
    ? `${getMeditationDisplayDuration(duration7)} min`
    : null;
  const subText4 = !favoritedCount
    ? null
    : `${getCountDisplayValue(favoritedCount)} ${
        favoritedCount === 1 ? `Favorite` : `Favorites`
      }`;
  const description = track.content;

  return (
    <Link
      href={generateQueryPath(`${routeConstants.PAGE_TRACK}/${track.slug}`, {
        utm_source,
        utm_campaign,
        userId,
        sentFrom: routeConstants.PAGE_NAMES[router.pathname],
      })}
      legacyBehavior>
      <a className="track-container clickable">
        {!!photoUrl && (
          <img
            src={photoUrl}
            alt={track.title}
            style={{
              borderRadius: '10px',
              height: 88,
              width: 88,
            }}
          />
        )}
        <div className="sub-container">
          <Text type="h4" weight="regular" color="b100">
            {track.title}
          </Text>
          <Text
            type="body2"
            color="b64"
            style={{
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
            }}>
            {description}
          </Text>
          <div className="row align-center">
            {subText1 && (
              <Text type="body2" color="b64">
                {`${subText1}`}
                {subText2 ? <span>&nbsp;|&nbsp;</span> : ''}
              </Text>
            )}
            {subText2 && (
              <Text type="body2" color="b64">
                {`${subText2}`}
              </Text>
            )}
            {subText4 && (
              <div className="row align-center">
                <div
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: '#0007',
                    marginLeft: 12,
                    marginRight: 6,
                  }}
                />
                <Text type="body2" color="b64">
                  {subText4}
                </Text>
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .track-container {
            display: flex;
            flex-direction: row;
            margin-bottom: 32px;
            flex-wrap: wrap;
          }
          .sub-container {
            margin-left: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            max-width: 60%;
          }
          @media only screen and (max-width: 992px) {
            .sub-container {
              max-width: 70%;
            }
          }
          @media only screen and (max-width: 767px) {
            .sub-container {
              max-width: 68%;
            }
          }
          @media only screen and (max-width: 346px) {
            .sub-container {
              max-width: 58%;
            }
          }
        `}</style>
      </a>
    </Link>
  );
}
