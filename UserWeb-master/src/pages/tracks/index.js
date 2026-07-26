import React from 'react';
import Head from 'next/head';
import TracksPage from '@/components/page/tracks';
import routeConstants from '@/utils/constants/routes';
import useTrackPageView from '@/hooks/trackPageView';
import { getMeditationCount, getMeditationList } from '@/models/meditation';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { isTestMode } from '@/utils';
import { wrapper } from '../../store';
import Loader from '../../components/app/Loader';
import LayoutWithNav from '../../layouts/LayoutWithNav';

function Tracks(serverProps) {
  const { meditationsTracks } = serverProps;
  useTrackPageView();

  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>{`Tracks - Aura`}</title>
        <meta
          name="description"
          content={`Listen to tracks and much more on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more.`}
        />
        <meta property="og:title" content={`Tracks - Aura`} />
        <meta
          property="og:description"
          content={`Listen to tracks and much more on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TRACKS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TRACKS}`}
        />
      </Head>
      {!meditationsTracks ? (
        <Loader />
      ) : (
        <TracksPage meditationsTracks={meditationsTracks} />
      )}
    </LayoutWithNav>
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      if (isTestMode()) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      let props = {};
      let meditationsTracks = [];
      try {
        const meditationCount = await getMeditationCount({
          useDayBucket: false,
        });
        const meditations = await getMeditationList({
          useDayBucket: false,
          limit: meditationCount.count,
        });
        const musicTracksCount = await getMeditationCount({
          useDayBucket: false,
          type: 'music',
        });
        const musicTracks = await getMeditationList({
          useDayBucket: false,
          type: 'music',
          limit: musicTracksCount.count,
        });
        if (!meditations.error) {
          meditationsTracks = [...meditationsTracks, ...meditations];
        }

        if (!musicTracks.error) {
          meditationsTracks = [...meditationsTracks, ...musicTracks];
        }
      } catch (err) {
        return { notFound: true };
      }

      if (meditationsTracks.length > 0) {
        props.meditationsTracks = meditationsTracks;
      }
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/tracks',
        })),
      };
      return { props };
    }
);

export default Tracks;
