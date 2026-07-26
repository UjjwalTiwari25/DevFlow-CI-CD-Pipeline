import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import Loader from '../../components/app/Loader';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import Text from '../../components/app/Text';
import { listContentTypes } from '../../models/contentTypes';
import { wrapper } from '../../store';
import CustomTopics from '../../components/content/CustomTopics';
import AuraContent from '../../services/AuraContent';
import routeConstants from '../../utils/constants/routes';
import useTrackPageView from '../../hooks/trackPageView';

async function fetchPageData() {
  const contentTypes = await listContentTypes();
  const exploreTopics = await AuraContent.fetchExploreTopicsData();
  return { contentTypes, exploreTopics };
}

function Explore(serverProps) {
  const { contentTypes, exploreTopics } = serverProps;
  useTrackPageView();
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>Meditations, Stories, Life Coaching Tracks - Aura</title>
        {/* TODO: We will need to improve these meta tags */}
        <meta
          name="description"
          content="Explore Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more."
        />
        <meta
          property="og:title"
          content="Meditations, Stories, Life Coaching Tracks - Aura"
        />
        <meta
          property="og:description"
          content="Explore Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_EXPLORE}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_EXPLORE}`}
        />
      </Head>
      <div className="page">
        {!contentTypes ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              Explore
            </Text>
            <CustomTopics
              data={Object.values(contentTypes)}
              label={'Content Types'}
            />
            {!!exploreTopics &&
              exploreTopics.map(({ id, label, data }) => (
                <CustomTopics key={id} data={data} label={label} />
              ))}
          </div>
        )}
      </div>
    </LayoutWithNav>
  );
}
export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }) => {
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      let props = await fetchPageData();
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/explore',
        })),
      };
      return { props };
    }
);

export default Explore;
