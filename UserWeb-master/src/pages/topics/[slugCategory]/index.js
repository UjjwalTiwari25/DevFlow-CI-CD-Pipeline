import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import { wrapper } from '../../../store';
import {
  getCategoryIdFromSlug,
  getSimilarTopics,
  getTopicCategoryByKey,
} from '../../../models/topic';
import Loader from '../../../components/app/Loader';
import CustomContent from '../../../components/content/CustomContent';
import LayoutWithNav from '../../../layouts/LayoutWithNav';
import TOPIC_DATA_ROWS from '../../../data/pageContent/topicPageRows.json';
import Text from '../../../components/app/Text';
import AuraContent from '../../../services/AuraContent';
import routeConstants from '../../../utils/constants/routes';
import ViewAllList from '../../../components/content/ViewAllList';
import useTrackPageView from '../../../hooks/trackPageView';
import CustomTopics from '../../../components/content/CustomTopics';

function Topic(serverProps) {
  const { pageContent, topic, slugCategory, similarTopics } = serverProps;
  const { title, key } = topic;
  useTrackPageView({ Title: title, TopicKey: key }, [topic]);
  useAllCoaches();

  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>{`${title} Tracks - Aura`}</title>
        <meta
          name="description"
          content={`Listen to ${title} tracks and much more on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more.`}
        />
        <meta property="og:title" content={`${title} Tracks - Aura`} />
        <meta
          property="og:description"
          content={`${title}: Listen to meditations, stories, life coaching, and much more on Aura`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}/${slugCategory}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_TOPICS}/${slugCategory}`}
        />
      </Head>
      <div>
        {!pageContent ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {title}
            </Text>
            {Object.values(TOPIC_DATA_ROWS).map((dataRow, index) =>
              dataRow.unique === 'popular' ? (
                <div key={index}>
                  <ViewAllList
                    data={pageContent[dataRow.unique]}
                    label={dataRow.contentType}
                    title={dataRow.title}
                    topic={key}
                  />
                </div>
              ) : (
                <CustomContent
                  key={dataRow.unique}
                  pageContent={pageContent}
                  rowData={dataRow}
                  topic={key}
                  sectionIndex={index}
                  viewAllLink={`/${routeConstants.PAGE_TOPICS}/${slugCategory}/${dataRow.viewAllPage}`}
                  showViewAllLink={dataRow.unique !== 'new'}
                />
              )
            )}
            <CustomTopics data={similarTopics} label={'Similar Topics'} />
          </div>
        )}
      </div>
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
      await store.dispatch(setAppLocale(getISOLocale(locale)));

      let props = {};
      const { slugCategory } = params;
      if (!slugCategory) {
        return {
          notFound: true,
        };
      }
      const categoryKey = await getCategoryIdFromSlug(slugCategory);
      if (!categoryKey) {
        return {
          notFound: true,
        };
      }

      const topic = await getTopicCategoryByKey(categoryKey);
      if (!topic) {
        return {
          notFound: true,
        };
      }
      const similarTopics = await getSimilarTopics(topic);
      const topicRows = {};
      Object.keys(TOPIC_DATA_ROWS).forEach((topicKey) => {
        const topicData = { ...TOPIC_DATA_ROWS[topicKey] };
        topicData.query = {
          ...topicData.query,
          topicCategory: categoryKey,
          shuffle: topicData.unique === 'popular',
        };
        if (topic.query?.type && topicData.query?.contentType) {
          // Only add row of content type which is allowed for topic
          if (topic.query.type === topicData.query.contentType) {
            topicRows[topicKey] = topicData;
          }
        } else {
          if (topic.query?.type) {
            topicData.query.contentType = topic.query.type;
          }
          topicRows[topicKey] = topicData;
        }
      });

      const pageContent = await AuraContent.fetchPageData(topicRows);
      props = {
        slugCategory,
        topic,
        ...pageContent,
        similarTopics,
        ...(await I18N.loadLocale({ locale, route: '/topics/[slugCategory]' })),
      };
      return { props };
    }
);

export default Topic;
