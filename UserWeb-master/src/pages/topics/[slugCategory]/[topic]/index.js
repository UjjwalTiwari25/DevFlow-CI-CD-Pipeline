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
import routeConstants from '../../../../utils/constants/routes';
import AuraContent from '../../../../services/AuraContent';
import TOPIC_DATA_ROWS from '../../../../data/pageContent/topicPageRows.json';
import {
  getCategoryIdFromSlug,
  getTopicCategoryByKey,
} from '../../../../models/topic';

async function fetchPageData(params) {
  const { slugCategory } = params;
  if (!slugCategory) {
    return {
      error: 'Slug not found',
    };
  }
  const categoryKey = await getCategoryIdFromSlug(slugCategory);

  if (!categoryKey) {
    return {
      error: 'Category key not found.',
    };
  }
  const topic = await getTopicCategoryByKey(categoryKey);
  if (!topic) {
    return {
      error: 'Topic not found',
    };
  }
  const topicRows = {};
  const topicData = Object.values(TOPIC_DATA_ROWS).find(
    (item) => item.viewAllPage === params.topic
  );
  if (!topicData) {
    return {
      error: 'Topic Data not found',
    };
  }
  topicData.query = {
    ...topicData.query,
    ...topic.query,
    limit: 50,
  };
  topicRows[topicData.unique] = topicData;

  const pageContent = await AuraContent.fetchPageData(topicRows);
  return {
    topic,
    slugCategory,
    topicData,
    ...pageContent,
  };
}

function ViewAllTopicTrack(serverProps) {
  const { pageContent, topicData, slugCategory, topic } = serverProps;
  const { unique, title, viewAllPage, contentType } = topicData;
  const pageData = Object.values(pageContent[unique]);
  const header = `${topic.title}: ${title}`;
  useAllCoaches();
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>{`${header} - Aura`}</title>
        <meta
          name="description"
          content={`Explore ${header} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${header} - Aura`} />
        <meta
          property="og:description"
          content={`Explore ${header} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}/${slugCategory}/${viewAllPage}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}/${slugCategory}/${viewAllPage}`}
        />
      </Head>
      <div className="page">
        {!pageData ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {header}
            </Text>
            <ViewAllList
              data={pageData}
              label={contentType}
              topic={topic.key}
            />
          </div>
        )}
      </div>
    </LayoutWithNav>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      let props = await fetchPageData(params);
      props.key = params.topic;
      if (props.error) return { notFound: true };

      await store.dispatch(setAppLocale(getISOLocale(locale)));
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/topics/[slugCategory]/[topic]',
        })),
      };
      return { props };
    }
);

export default ViewAllTopicTrack;
