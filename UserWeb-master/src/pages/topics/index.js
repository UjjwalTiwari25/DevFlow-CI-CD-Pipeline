import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import Loader from '../../components/app/Loader';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import Text from '../../components/app/Text';
import { wrapper } from '../../store';
import CustomTopics from '../../components/content/CustomTopics';
import AuraContent from '../../services/AuraContent';
import routeConstants from '../../utils/constants/routes';
import useTrackPageView from '../../hooks/trackPageView';

async function fetchPageData() {
  const topics = await AuraContent.fetchExploreTopicsData();
  return { topics };
}

function Topics(serverProps) {
  const { topics } = serverProps;
  useTrackPageView();
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>Topics - Aura</title>
        <meta
          name="description"
          content="Explore all the topics on Aura and listen to guided meditations, stories, life coaching tracks and much more."
        />
        <meta property="og:title" content="Topics - Aura" />
        <meta
          property="og:description"
          content="Explore all the topics on Aura and listen to guided meditations, stories, life coaching tracks and much more."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}`}
        />
      </Head>
      <div className="page">
        {!topics ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              Topics
            </Text>
            {topics.map(({ id, label, data }) => (
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
        ...(await I18N.loadLocale({ locale, route: '/topics' })),
      };
      return { props };
    }
);

export default Topics;
