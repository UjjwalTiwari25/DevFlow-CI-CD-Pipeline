import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import Text from '../../../../components/app/Text';
import LayoutWithNav from '../../../../layouts/LayoutWithNav';
import ViewAllList from '../../../../components/content/ViewAllList';
import Loader from '../../../../components/app/Loader';
import { wrapper } from '../../../../store';
import { getCoachFromSlug } from '../../../../models/coach';
import {
  filterActiveTracks,
  listMeditations,
} from '../../../../models/meditation';
import routeConstants from '../../../../utils/constants/routes';
import contentConstants from '../../../../utils/constants/content';

async function fetchPageData(query) {
  if (!query.slugCoach) {
    return {
      error: 'CoachId not found',
    };
  }
  const { slugCoach } = query;

  const coach = await getCoachFromSlug(slugCoach);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  const { id } = coach;
  let tracks = [];
  if (coach && coach.tracks) {
    tracks = await listMeditations(Object.keys(coach.tracks));
    tracks = await filterActiveTracks(tracks);
  }
  if (tracks.length < 1) {
    return {
      error: 'Tracks not found',
    };
  }
  return {
    tracks,
    coachId: id,
    coach,
  };
}

function ViewAllCoachTracks(serverProps) {
  const { tracks, coach } = serverProps;
  useAllCoaches();

  return (
    <LayoutWithNav>
      <Head>
        <title>{`Tracks by ${coach.name} - Aura`}</title>
        <meta
          name="description"
          content={`Explore tracks by ${coach.name} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`Tracks by ${coach.name} - Aura`} />
        <meta
          property="og:description"
          content={`Explore tracks by ${coach.name} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/${contentConstants.CONTENT_UI_TYPES.TRACKS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/${contentConstants.CONTENT_UI_TYPES.TRACKS}`}
        />
      </Head>
      <div className="page">
        {!tracks ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {`Tracks by ${coach.name}`}
            </Text>
            <ViewAllList data={tracks} label={'tracks'} />
          </div>
        )}
      </div>
    </LayoutWithNav>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      let props = await fetchPageData(query);
      if (props.error) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));

      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/coaches/[slugCoach]/tracks',
        })),
      };
      return { props };
    }
);

export default ViewAllCoachTracks;
