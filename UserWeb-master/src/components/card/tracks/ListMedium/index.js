import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Text from '../../../app/Text';
import {
  getMeditationDisplayDuration,
  getMeditationPhoto,
  trackTypeDisplayStringFromId,
} from '../../../../models/meditation';
import routeConstants from '../../../../utils/constants/routes';
import usePageQuery from '../../../../hooks/pageQuery';
import { generateQueryPath } from '../../../../utils';
import styles from './styles';

export default function ListMedium({
  track,
  style,
  isClickable = true,
  hideContentType,
  sectionLabel = null,
  sectionIndex = null,
  sectionTrackIndex = null,
  topic = null,
}) {
  const { title, duration, duration7, trackType, slug, score, modelSource } =
    track;
  const {
    utm_source = null,
    userId = null,
    utm_campaign = null,
  } = usePageQuery();
  const router = useRouter();

  const photoUrl = getMeditationPhoto(track, 'photo200Url');
  const subText1 = duration
    ? `${getMeditationDisplayDuration(duration)} min`
    : null;
  const subText2 = duration7
    ? `${getMeditationDisplayDuration(duration7)} min`
    : null;
  const Component = isClickable ? Link : 'span';
  return (
    <div className="wrapper">
      <img src={`${photoUrl}`} alt="background" className="blur-background" />
      <div className="root" style={style}>
        <Component
          href={generateQueryPath(`${routeConstants.PAGE_TRACK}/${slug}`, {
            utm_source,
            utm_campaign,
            userId,
            modelSource: modelSource?.join(','),
            score,
            sentFrom: routeConstants.PAGE_NAMES[router.pathname],
            sectionLabel,
            sectionTrackIndex,
            sectionIndex,
            topic,
          })}
          className={`item-container ${isClickable && 'clickable'}`}
          style={{
            backgroundImage: `linear-gradient(transparent, #0008),
          url("${photoUrl}")`,
          }}>
          {trackType && !hideContentType && (
            <Text type="body2" color="w64" weight="regular">
              {trackTypeDisplayStringFromId(trackType)}
            </Text>
          )}
          <Text
            type="body"
            color="w100"
            weight="regular"
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
          <div className="row align-center">
            {subText1 && (
              <Text type="footnote" color="w100">
                {`${subText1}`}
                {subText2 ? <span>&nbsp;|&nbsp;</span> : ''}
              </Text>
            )}
            {subText2 && (
              <Text type="footnote" color="w100">
                {`${subText2}`}
              </Text>
            )}
          </div>
        </Component>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
