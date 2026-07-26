import React, { useMemo, useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { isUserContentSubscriber } from '@/models/user';
import useAuthUser from '@/hooks/authUser';
import TrackVideoPlayer from '@/components/meditation/TrackVideoPlayer';
import pricingConstants from '@/utils/constants/pricing';
import {
  getMeditationDisplayDuration,
  getMeditationPosts,
  trackTypeDisplayStringFromId,
} from '../../../../models/meditation';
import { getCoachName, getCoachPhoto } from '../../../../models/coach';
import Text from '../../../app/Text';
import ExploreAura from '../../../content/ExploreAura';
import Player from '../../../meditation/Player';
import styles from './styles';
import { getCountDisplayValue, generateQueryPath } from '../../../../utils';
import routeConstants from '../../../../utils/constants/routes';
import CustomPosts from '../../../content/CustomPosts';
import useResponsiveWindow from '../../../../hooks/responsiveWindow';
import Channel from '../../../card/channel/Channel';
import useTrackPageView from '../../../../hooks/trackPageView';
import usePageQuery from '../../../../hooks/pageQuery';

export default function TrackMeditationSlug({ track, channel, coach }) {
  const { user } = useAuthUser();

  const {
    id: trackId,
    trackType,
    content,
    favoritedCount,
    playedCount,
    session,
    title,
    unguided,
  } = track || {};
  const [isTrackUnlocked, setIsTrackUnlocked] = useState(false);
  const [posts, setPosts] = useState();

  const {
    modelSource = null,
    score = null,
    sectionLabel = null,
    sectionTrackIndex = null,
    sectionIndex = null,
    sentFrom = null,
    topic = null,
    utm_source = null,
    userId = null,
    utm_campaign = null,
    aftp: allowFullTrackPlay = null,
  } = usePageQuery();

  const [, isMobile] = useResponsiveWindow();
  const coachPath = coach ? coach.slug : null;
  useTrackPageView(
    {
      Session: session,
      Title: title,
      Channel: channel?.key,
      Type: trackType,
      Guided: !unguided,
      'Sent from': sentFrom || utm_source,
    },
    [track]
  );

  useEffect(() => {
    async function getPosts() {
      let allPosts = await getMeditationPosts(trackId);
      allPosts = allPosts.filter(function removeNullPosts(element) {
        return element !== null;
      });
      setPosts(allPosts);
    }
    getPosts();
  }, [trackId]);

  const analyticsOptions = useMemo(
    () => ({
      duration: track.duration ? Math.round(track.duration / 60) : 0,
      offline: false,
      sentFrom: sentFrom || utm_source || null,
      sectionLabel,
      sectionTrackIndex,
      sectionIndex,
      topic,
      modelSource: (modelSource && modelSource.split(',')) || null,
      score,
    }),
    [
      track,
      utm_source,
      sectionLabel,
      sectionTrackIndex,
      sectionIndex,
      topic,
      modelSource,
      score,
      sentFrom,
    ]
  );

  const redirectToSubscribe = useCallback(() => {
    Router.push(
      generateQueryPath(
        `${routeConstants.PAGE_SUBSCRIBE}/${pricingConstants.PRICING_DEFAULT}`,
        {
          redirectTo: Router.asPath,
          utm_source,
          userId,
          utm_campaign,
        }
      )
    );
  }, [utm_source, utm_campaign, userId]);

  useEffect(() => {
    if (
      (user && isUserContentSubscriber(user)) ||
      allowFullTrackPlay === 'true'
    ) {
      setIsTrackUnlocked(true);
    } else {
      setIsTrackUnlocked(false);
    }
  }, [allowFullTrackPlay, user]);

  return (
    <div>
      <div className="meditation-container">
        {track?.videoUrl ? (
          <TrackVideoPlayer
            track={track}
            analyticsOptions={analyticsOptions}
            redirectToSubscribe={redirectToSubscribe}
            isTrackUnlocked={isTrackUnlocked}
          />
        ) : (
          <Player
            track={track}
            analyticsOptions={analyticsOptions}
            redirectToSubscribe={redirectToSubscribe}
            isTrackUnlocked={isTrackUnlocked}
          />
        )}
      </div>
      <div className="track-content">
        <Text color="b100" type="h3" component="h1" weight="regular">
          {track.title}
        </Text>
        <div className="meditation-stats">
          <Text
            type="body"
            color="b64"
            weight="regular"
            style={{
              maxWidth: isMobile ? 120 : 60,
              marginRight: 20,
              marginTop: isMobile ? 8 : 0,
            }}>
            {`${getMeditationDisplayDuration(track.duration)} Min`}
          </Text>
          <Text
            color="b64"
            type="body"
            weight="regular"
            style={{
              marginRight: 20,
              marginTop: isMobile ? 8 : 0,
            }}>
            {trackTypeDisplayStringFromId(trackType)}
          </Text>
          {playedCount >= 1000 && (
            <Text
              color="b64"
              type="body"
              weight="regular"
              style={{
                maxWidth: 120,
                marginRight: 20,
                marginTop: isMobile ? 8 : 0,
              }}>
              {`${getCountDisplayValue(playedCount)} Plays`}
              {/* &nbsp;|&nbsp; */}
            </Text>
          )}
          {favoritedCount && (
            <Text
              color="b64"
              type="body"
              weight="regular"
              style={{
                marginTop: isMobile ? 8 : 0,
              }}>
              {`${getCountDisplayValue(favoritedCount)} ${
                favoritedCount === 1 ? `Favorite` : `Favorites`
              }`}
              {/* &nbsp;|&nbsp; */}
            </Text>
          )}
        </div>
        <br />
        {!!coach && (
          <Link
            href={
              coachPath
                ? `/${routeConstants.PAGE_COACHES}/${coachPath}`
                : `/${routeConstants.PAGE_COACHES}`
            }
            className="clickable"
            style={{ display: 'inline-flex', marginTop: '44px' }}>
            <div>
              <img
                src={getCoachPhoto(coach, 'photo100Url')}
                alt="Avatar"
                className="avatar"></img>
            </div>
            <div style={{ display: 'inline-block' }}>
              <div style={{ textAlign: 'left' }}>
                <Text color="b100" type="body" weight="regular">
                  {getCoachName(coach)}
                </Text>
                <Text color="b64" type="body2" weight="regular">
                  {coach.professionalTitle || ''}
                </Text>
              </div>
            </div>
          </Link>
        )}
        <Text
          color="b64"
          type="body"
          weight="regular"
          style={{
            marginTop: 40,
            marginBottom: 50,
            maxWidth: 800,
            whiteSpace: 'pre-wrap',
          }}>
          {content}
        </Text>
        {channel && <Channel key={channel.key} channel={channel} />}
        {posts && <CustomPosts data={posts} label="From the community" />}
        <div style={{ marginTop: '40px' }}>
          <ExploreAura />
        </div>
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}
