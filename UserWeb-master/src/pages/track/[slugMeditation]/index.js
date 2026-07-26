import React, { useCallback } from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import BaseLayout from '../../../layouts/BaseLayout';
import LayoutWithNav from '../../../layouts/LayoutWithNav';
import { wrapper } from '../../../store';
import {
  getMeditation,
  getMeditationPhoto,
  getMeditationIdFromSlug,
  getChannelAuthorName,
} from '../../../models/meditation';
import { getCoach, getCoachName } from '../../../models/coach';
import routeConstants from '../../../utils/constants/routes';
import Loader from '../../../components/app/Loader';
import { formatSecondsAsTime } from '../../../utils';
import urlFormater from '../../../utils/urlFormater';
import { getChannel } from '../../../models/channel';
import usePageQuery from '../../../hooks/pageQuery';
import TrackMeditationSlug from '../../../components/page/track/[slugMeditation]';
import { validateTrackSlug } from '../../../utils/validators';

function formatTrackData(track) {
  if (!track) return null;

  const {
    id,
    title,
    slug,
    duration,
    url,
    trackType,
    content,
    contentShort,
    photoUrl,
    videoUrl,
    session,
    userId,
    playedCount,
    favoritedCount,
    unguided,
    duration7,
    url7,
  } = track || {};

  const formattedTrack = {
    id: id ?? null,
    title: title ?? null,
    slug: slug ?? null,
    duration: duration ?? null,
    url: url ?? null,
    trackType: trackType ?? null,
    content: content ?? null,
    contentShort: contentShort ?? null,
    photoUrl: photoUrl ?? null,
    videoUrl: videoUrl ?? null,
    session: session ?? null,
    userId: userId ?? null,
    playedCount: playedCount ?? null,
    favoritedCount: favoritedCount ?? null,
    unguided: unguided ?? null,
    duration7: duration7 ?? null,
    url7: url7 ?? null,
  };

  return formattedTrack;
}

function formatCoachData(coach) {
  if (!coach) return null;

  const {
    name,
    slug,
    professionalTitle,
    photo100Url,
    profilePictureThumbs,
    profilePicture,
  } = coach || {};

  const formattedCoach = {
    name: name ?? null,
    slug: slug ?? null,
    professionalTitle: professionalTitle ?? null,
    photo100Url: photo100Url ?? null,
    profilePicture: profilePicture ?? null,
  };

  if (profilePictureThumbs) {
    formattedCoach.profilePictureThumbs = {
      photo100Url: profilePictureThumbs?.photo100Url ?? null,
    };
  } else {
    formattedCoach.profilePictureThumbs = {
      photo100Url: null,
    };
  }

  return formattedCoach;
}

async function fetchPageData(query) {
  const slug = query[routeConstants.SLUG_MEDITATION];

  // Validate the slug
  if (!validateTrackSlug(slug).isValid) {
    return { error: 'Invalid track' };
  }

  let trackId = await getMeditationIdFromSlug(slug);
  if (!trackId) {
    trackId = urlFormater.getIDFromURL(slug);
  }
  if (!trackId) {
    return { error: 'trackId is not valid' };
  }
  const track = await getMeditation(trackId);
  if (!track) {
    return {
      error: 'track not found',
    };
  }
  const coach = await getCoach(track.userId);
  const channel = track.channel ? await getChannel(track.channel.key) : null;

  const formattedTrack = formatTrackData(track);
  const formattedCoach = formatCoachData(coach);

  return {
    track: formattedTrack,
    coach: formattedCoach,
    channel,
  };
}

function getMetaDescription(track, coach) {
  const { content, contentShort, title } = track || {};
  if (contentShort) return contentShort;
  if (content) return content.replace(/\n/g, ' ');
  return `Listen to ${title} by ${
    coach ? getCoachName(coach) : getChannelAuthorName(track)
  } on Aura.`;
}

function Meditation(serverProps) {
  const { track, channel, coach } = serverProps;
  const { userId } = usePageQuery({ fetchUserFromQuery: true });
  const { title, duration, slug } = track || {};
  useAllCoaches();

  const seoTrackDesc = useCallback(() => {
    let desc = getMetaDescription(track, coach);
    if (desc.length <= 33) {
      desc = `${desc} Listen to this track and much more on Aura - the #1 Mindfulness, Life Coaching and Sleep App`;
    } else if (desc.length <= 90) {
      desc = `${desc} Listen to this track and much more on Aura - the #1 Mindfulness App`;
    } else if (desc.length <= 99) {
      desc = `${desc} Listen to this track and much more on Aura.`;
    }
    return desc;
  }, [coach, track]);

  const seoTrackTitle = useCallback(() => {
    let pageTitle = `${title} by ${getCoachName(coach)} (${formatSecondsAsTime(
      duration,
      {
        isString: true,
      }
    )}) - Aura`;
    if (pageTitle.length > 70) {
      pageTitle = `${title} (${formatSecondsAsTime(duration, {
        isString: true,
      })}) - Aura`;
    }
    if (pageTitle.length > 70) {
      pageTitle = `${title} - Aura`;
    }
    if (pageTitle.length > 70) {
      pageTitle = `${title}`;
    }
    return pageTitle;
  }, [title, coach, duration]);

  if (!track) {
    return (
      <BaseLayout>
        <Loader />
      </BaseLayout>
    );
  }

  return (
    <LayoutWithNav isUserFromQuery={!!userId} showSEOFooter>
      <Head>
        <title>{seoTrackTitle()}</title>
        <meta name="description" content={seoTrackDesc()} />
        <meta property="og:title" content={seoTrackTitle()} />
        <meta
          itemProp="image"
          property="og:image"
          content={getMeditationPhoto(track)}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TRACK}/${slug}`}
        />
        <meta property="og:description" content={seoTrackDesc()} />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TRACK}/${slug}`}
        />
      </Head>
      <TrackMeditationSlug track={track} channel={channel} coach={coach} />
    </LayoutWithNav>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, res, locale }) => {
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${60 * 60 * 24}, stale-while-revalidate=${
          60 * 60 * 24
        }`
      );
      let props = await fetchPageData(params);
      if (props.track) {
        props.key = props.track.slug;
      }
      const notFound = !!props.error;

      await store.dispatch(setAppLocale(getISOLocale(locale)));
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/track/[slugMeditation]',
        })),
      };
      return { props, notFound };
    }
);

export default Meditation;
