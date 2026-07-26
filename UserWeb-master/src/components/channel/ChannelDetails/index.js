import React, { useCallback } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Loader from '../../app/Loader';
import { generateQueryPath, getCountDisplayValue } from '../../../utils';
import useResponsiveWindow from '../../../hooks/responsiveWindow';
import Text from '../../app/Text';
import routeConstants from '../../../utils/constants/routes';
import ClippedText from '../../app/ClippedText';
import ListSmall from '../../card/tracks/ListSmall';
import useTrackPageView from '../../../hooks/trackPageView';
import styles from './styles';

function ChannelDetails({ serverProps }) {
  const [, isMobile] = useResponsiveWindow();
  const { channel, tracks, coach } = serverProps;
  const {
    channelName,
    channelPicture,
    authorName,
    authorPhoto,
    channelDescriptionLong,
    nSubscribers = 0,
    listenedCount = 0,
    playedCount = 0,
    slug,
    id,
  } = channel || {};

  const seoChannelTitle = useCallback(() => {
    let pageTitle = `${channelName} by ${authorName} - Aura`;
    if (pageTitle.length > 70) {
      pageTitle = `${channelName} - Aura`;
    }
    return pageTitle;
  }, [authorName, channelName]);

  const seoChanneDescription = useCallback(() => {
    let pageDescription = `Explore channel ${channelName} by ${authorName} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`;
    if (pageDescription.length > 160) {
      pageDescription = `Explore channel ${channelName} by ${authorName} on Aura, #1 app for mindfulness, mental wellness, & sleep.`;
    }
    return pageDescription;
  }, [authorName, channelName]);

  useTrackPageView(
    {
      Channel: id,
      'Channel Name': channelName,
      CoachID: coach?.id,
      'Coach Name': authorName,
    },
    [channel]
  );

  if (!channel) {
    return <Loader />;
  }

  const maxPlays = Math.max(listenedCount, playedCount);
  return (
    <>
      <Head>
        <title>{seoChannelTitle()}</title>
        <meta name="description" content={seoChanneDescription()} />
        <meta property="og:title" content={seoChannelTitle()} />
        <meta property="og:description" content={seoChanneDescription()} />
        <meta itemProp="image" property="og:image" content={channelPicture} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}/${slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}/${slug}`}
        />
      </Head>
      <div className="outer-wrap">
        <img
          src={channelPicture}
          alt="channel picture"
          width={250}
          height={250}
          style={{ borderRadius: '16px' }}
        />
        <div className="channel-cover">
          <Text
            type={isMobile ? 'h3-large' : 'h2'}
            component="h1"
            color="b100"
            align={isMobile ? 'center' : 'left'}>
            {channelName}
          </Text>
          <div className="row align-center">
            {nSubscribers > 0 && (
              <Text type="body" color="b100">
                {`${getCountDisplayValue(nSubscribers)} subscribers`}
                &nbsp;|&nbsp;
              </Text>
            )}
            <Text type="body" color="b100">{`${getCountDisplayValue(
              maxPlays
            )} plays`}</Text>
          </div>
          <Link
            href={generateQueryPath(
              `${routeConstants.PAGE_COACHES}/${coach.slug}`
            )}
            className="clickable">
            <div className="row align-center clickable author-image">
              {!!authorPhoto && (
                <span className="author-photo">
                  <Image src={authorPhoto} alt={authorName} fill />
                </span>
              )}
              <div>
                <Text type="body" color="b100">
                  {authorName}
                </Text>
                <Text type="body2" color="b64">
                  {coach.professionalTitle}
                </Text>
              </div>
            </div>
          </Link>
          <ClippedText
            type="body2"
            color="b64"
            style={{
              width: '95%',
            }}>
            {channelDescriptionLong}
          </ClippedText>
        </div>
      </div>

      <div className="track-width">
        <Text
          type="h4"
          weight="regular"
          color="b100"
          style={{ marginBottom: 24 }}>
          All Tracks
        </Text>
        {tracks && Array.isArray(tracks) ? (
          tracks.map((track) =>
            track ? <ListSmall key={track.id} track={track} /> : null
          )
        ) : (
          <Loader />
        )}
      </div>
      <style jsx>{styles}</style>
    </>
  );
}
export default ChannelDetails;
