import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
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
import useCoachDetails from '../../../../hooks/coachDetails';
import { getCoachPhoto } from '../../../../models/coach';
import useThemeListener from '../../../../hooks/themeListener';
import Analytics from '../../../../services/Analytics';

export default function FloatingContentCard({
  track,
  style,
  isClickable = true,
  hideContentType,
  sectionLabel = null,
  sectionIndex = null,
  sectionTrackIndex = null,
  topic = null,
  isFixedSize = false,
  isCoachPlan = false,
  isNewVPCopy = false,
  newCoachProfile = false,
  contentPreview,
  contentGridPreview,
  wrapperStyles,
}) {
  const { title, duration, duration7, trackType, slug, score, modelSource } =
    track;
  const {
    utm_source = null,
    userId = null,
    utm_campaign = null,
  } = usePageQuery();
  const router = useRouter();
  const { coachDetails } = useCoachDetails(track.userId);
  const { isDark } = useThemeListener();
  const photoUrl = getMeditationPhoto(track, 'photo200Url');
  const photoBlurUrl = getMeditationPhoto(track, 'photo50Url');
  const subText1 = duration
    ? `${getMeditationDisplayDuration(duration)} min`
    : null;
  const subText2 = duration7
    ? `${getMeditationDisplayDuration(duration7)} min`
    : null;
  const Component = isClickable ? Link : 'span';
  const fontColor = isDark ? 'b100' : 'w100';

  function handleAnalytics() {
    if (contentGridPreview || contentPreview) {
      Analytics.track('Content Card Tapped', {
        UserId: userId,
        TrackId: track.id,
      });
    }
  }

  return (
    <div
      className={classNames({
        'wrapper-is-fixed': isFixedSize || isNewVPCopy,
        wrapper:
          !isFixedSize &&
          !isNewVPCopy &&
          !contentGridPreview &&
          !contentPreview,
        'grid-wrapper': contentGridPreview,
        'content-wrapper': contentPreview,
      })}
      style={wrapperStyles}>
      {((!isFixedSize && !isNewVPCopy) || isCoachPlan || newCoachProfile) &&
        !contentPreview &&
        !contentGridPreview && (
          <img
            src={`${photoBlurUrl}`}
            alt="background"
            className={`${
              newCoachProfile ? 'blur-background-short' : 'blur-background'
            }`}
          />
        )}
      {isFixedSize &&
        !newCoachProfile &&
        !contentPreview &&
        !contentGridPreview && (
          <div
            className="blur-background-fixed"
            style={{
              backgroundImage: `url("${photoBlurUrl}"))`,
            }}></div>
        )}
      {isNewVPCopy && !contentPreview && !contentGridPreview && (
        <div
          className="blur-background-vp"
          style={{
            backgroundImage: `url("${photoBlurUrl}")`,
          }}></div>
      )}
      <div
        className={classNames({
          'root-is-fixed ': isFixedSize,
          root:
            !isFixedSize &&
            !isCoachPlan &&
            !isNewVPCopy &&
            !contentPreview &&
            !contentGridPreview,
          'root-coach-plan': isCoachPlan,
          'root-vp-copy': isNewVPCopy,
          'margin-right': newCoachProfile,
          'wide-card': newCoachProfile,
          'content-preview-root': contentPreview,
          'grid-root': contentGridPreview,
        })}
        style={style}>
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
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)),
        url("${photoUrl}")`,
          }}
          onClick={() => handleAnalytics()}>
          {trackType && !hideContentType && (
            <div
              className={classNames('track-type', {
                'track-type-down': contentPreview,
              })}>
              <Text
                type="footnote"
                color={isDark ? 'b64' : 'w64'}
                weight="regular">
                {trackTypeDisplayStringFromId(
                  trackType,
                  contentGridPreview && trackType === 'therapy'
                )}
              </Text>
            </div>
          )}
          <Text
            type="cta"
            color={fontColor}
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
          <div className="row align-center">
            {subText1 && (
              <Text type="footnote" color={fontColor}>
                {`${subText1}`}
                {subText2 ? <span>&nbsp;|&nbsp;</span> : ''}
              </Text>
            )}
            {subText2 && (
              <Text type="footnote" color={fontColor}>
                {`${subText2}`}
              </Text>
            )}
          </div>
          <div
            className={classNames({
              'coach-container-is-fixed': isFixedSize || isNewVPCopy,
              'coach-container': !isFixedSize || !isNewVPCopy,
              'align-end': contentPreview,
            })}>
            {coachDetails && !!getCoachPhoto(coachDetails, 'photo100Url') && (
              <span className="coach-thumbnail">
                <Image
                  src={getCoachPhoto(coachDetails, 'photo100Url')}
                  alt="coach photo"
                  fill
                />
              </span>
            )}
            <div
              className={classNames('coach-information', {
                'content-coach-info': contentPreview,
              })}>
              {coachDetails && (
                <Text type="body2" align="left" weight="bold" color={fontColor}>
                  {coachDetails.name || 'Aura'}
                </Text>
              )}
              {coachDetails && (
                <div className="professional-title">
                  <Text
                    type="footnote"
                    align="left"
                    weight="regular"
                    color={fontColor}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}>
                    {coachDetails.professionalTitle}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </Component>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
