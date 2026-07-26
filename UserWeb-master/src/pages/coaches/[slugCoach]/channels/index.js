import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import Text from '../../../../components/app/Text';
import LayoutWithNav from '../../../../layouts/LayoutWithNav';
import ViewAllList from '../../../../components/content/ViewAllList';
import Loader from '../../../../components/app/Loader';
import { wrapper } from '../../../../store';
import { getCoachChannels, getCoachFromSlug } from '../../../../models/coach';
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
  let channels = [];
  if (coach.channels) {
    channels = await getCoachChannels(Object.keys(coach.channels));
  } else {
    return {
      error: 'Channels not found',
    };
  }
  return {
    channels,
    coach,
  };
}

function ViewAllCoachChannels(serverProps) {
  const { channels, coach } = serverProps;

  return (
    <LayoutWithNav>
      <Head>
        <title>{`Channels by ${coach ? coach.name : ''} - Aura`}</title>
        <meta
          name="description"
          content={`Explore channels by ${
            coach ? coach.name : ''
          } and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          property="og:title"
          content={`Channels by ${coach ? coach.name : ''} - Aura`}
        />
        <meta
          property="og:description"
          content={`Explore channels by ${
            coach ? coach.name : ''
          } and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/${contentConstants.CONTENT_UI_TYPES.CHANNELS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/${contentConstants.CONTENT_UI_TYPES.CHANNELS}`}
        />
      </Head>
      <div className="page">
        {!channels ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {`Channels by ${coach ? coach.name : ''}`}
            </Text>
            <ViewAllList data={channels} label={'channels'} />
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
          route: '/coaches/[slugCoach]/channels',
        })),
      };
      return { props };
    }
);
export default ViewAllCoachChannels;
