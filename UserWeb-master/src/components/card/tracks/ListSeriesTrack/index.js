import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import classNames from 'classnames';
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
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import useAuthUser from '../../../../hooks/authUser';

export default function ListSeriesTrack({
  track,
  index,
  series,
  userSeries,
  tracks,
  coach,
}) {
  const {
    title,
    duration,
    duration7,
    trackType,
    slug,
    score,
    modelSource,
    content,
  } = track || {};
  const { user } = useAuthUser();

  const trackListenStatus = useCallback(() => {
    const isSeriesIncluded =
      userSeries && userSeries[series.id] && userSeries[series.id].tracks;
    if (!user) {
      return false;
    }
    if (
      isSeriesIncluded &&
      Object.keys(userSeries[series.id].tracks).includes(track.id)
    ) {
      return true;
    }
    if (
      isSeriesIncluded &&
      Object.keys(userSeries[series.id].tracks).includes(tracks[index - 1].id)
    ) {
      return 'next';
    }
    if (!isSeriesIncluded) {
      return false;
    }
    return false;
  }, [index, series, track, tracks, userSeries, user]);

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
  function handleRedirect() {
    const path = generateQueryPath(`${routeConstants.PAGE_TRACK}/${slug}`, {
      utm_source,
      utm_campaign,
      userId,
      modelSource: modelSource?.join(','),
      score,
      sentFrom: routeConstants.PAGE_NAMES[router.pathname],
    });
    router.push(path);
  }

  return (
    <div
      className="track-container relative clickable"
      onClick={() => {
        handleRedirect();
      }}>
      <div className="track-info row">
        <div className="relative track-photo-container">
          {!!photoUrl && (
            <img
              src={photoUrl}
              alt="aura track"
              width={86}
              height={116}
              style={{ borderRadius: '10px', height: 116, width: 86 }}
            />
          )}
          <div className="text">
            <Text type="h2-small" color="w64">
              {index + 1}
            </Text>
          </div>
        </div>
        <div>
          <Text type="cta" weight="semibold" color="b100">
            {title}
          </Text>
          <Text
            type="body"
            weight="regular"
            color="b64"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              maxWidth: 410,
              marginTop: 4,
              lineHeight: '21px',
            }}>
            {content}
          </Text>
          <div className="duration-container row align-center">
            <Text type="footnote" color="b64">
              {trackTypeDisplayStringFromId(trackType)}
            </Text>
            <div className="dot"></div>
            {subText1 && (
              <Text type="footnote" color="b64">
                {`${subText1}`}
                {subText2 ? <span>&nbsp;|&nbsp;</span> : ''}
              </Text>
            )}
            {subText2 && (
              <Text type="footnote" color="b64">
                {`${subText2}`}
              </Text>
            )}
          </div>
        </div>
      </div>
      <hr className="hr" />
      <div className="coach-info row">
        <div className="row align-center">
          {!!getCoachPhoto(coach) && (
            <span className="coach-photo">
              <Image src={getCoachPhoto(coach)} alt="aura coach" fill />
            </span>
          )}
          <div className="coach-name">
            <Text type="body2" color="b100">
              {getCoachName(coach)}
            </Text>
            <Text type="body2" color="b64" style={{ marginTop: 4 }}>
              {coach.professionalTitle}
            </Text>
          </div>
        </div>
        <div
          className={classNames(
            'clickable button row align-center justify-center',
            {
              'green-background': trackListenStatus() === true,
              'blue-background': trackListenStatus() === 'next',
              white: !trackListenStatus(),
            }
          )}>
          <Text
            type="body2"
            color={trackListenStatus() ? 'w100' : 'b100'}
            weight={trackListenStatus() ? 'semibold' : 'regular'}>
            Day {index + 1}
          </Text>
          {trackListenStatus() === true && (
            <img
              src="/static/images/icons/played.png"
              alt="aura icon"
              className="played-icon"
            />
          )}
          {(trackListenStatus() === 'next' || !trackListenStatus()) && (
            <img
              src={
                trackListenStatus() === 'next'
                  ? '/static/images/icons/next-white.png'
                  : '/static/images/icons/next.png'
              }
              alt="aura icon"
              className="next"
            />
          )}
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
