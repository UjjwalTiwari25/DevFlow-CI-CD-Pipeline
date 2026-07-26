import React from 'react';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { getChannel, getChannelIdFromSlug } from '../../../models/channel';
import { getCoach } from '../../../models/coach';
import {
  filterActiveTracks,
  listMeditations,
} from '../../../models/meditation';
import Loader from '../../../components/app/Loader';
import LayoutWithNav from '../../../layouts/LayoutWithNav';
import { wrapper } from '../../../store';
import routeConstants from '../../../utils/constants/routes';
import CHANNEL_TOPICS_SLUG_KEYS from '../../../data/pageContent/channelsSlugKeyMappings.json';
import CHANNEL_PAGE_ROWS from '../../../data/pageContent/channelsPageRows.json';
import AuraContent from '../../../services/AuraContent';
import ChannelDetails from '../../../components/channel/ChannelDetails';
import ChannelsList from '../../../components/channel/ChannelsList';

async function fetchPageData(query) {
  if (!query[routeConstants.SLUG_CHANNEL]) {
    return {
      error: 'slugChannel not found',
    };
  }
  const channelId = await getChannelIdFromSlug(
    query[routeConstants.SLUG_CHANNEL]
  );

  if (!channelId) {
    return { error: 'ChannelId is not valid' };
  }

  const channel = await getChannel(channelId);
  if (!channel) {
    return {
      error: 'Channel not found',
    };
  }
  const coach = await getCoach(channel.userId);
  const tracks = await fetchTracks(channel);
  return {
    channel,
    tracks,
    coach,
  };
}

async function fetchTracks(channel) {
  let meditations = [];
  if (channel && channel.tracks) {
    const tracks = Object.values(channel.tracks);
    tracks.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    meditations = await listMeditations(tracks.map((track) => track.session));
    meditations = await filterActiveTracks(meditations);
  }
  return meditations;
}

function SlugChannel(serverProps) {
  const { viewChannelsList } = serverProps;
  if (!serverProps) {
    return (
      <LayoutWithNav>
        <Loader />
      </LayoutWithNav>
    );
  }

  return (
    <LayoutWithNav showSEOFooter>
      {viewChannelsList ? (
        <ChannelsList serverProps={serverProps} />
      ) : (
        <ChannelDetails serverProps={serverProps} />
      )}
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
      let props = {};
      const slugChannelKey =
        CHANNEL_TOPICS_SLUG_KEYS[params[routeConstants.SLUG_CHANNEL]];
      if (slugChannelKey) {
        const channelTopic = CHANNEL_PAGE_ROWS[slugChannelKey];
        const { pageContent } = await AuraContent.fetchPageData({
          [slugChannelKey]: channelTopic,
        });
        props = {
          pageContent,
          viewChannelsList: true,
          channelTopic,
        };
      } else {
        props = await fetchPageData(params);
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      const notFound = !!props.error;
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/channels/[slugChannel]',
        })),
      };
      return { props, notFound };
    }
);

export default SlugChannel;
