import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import Text from '../../../components/app/Text';
import LayoutWithNav from '../../../layouts/LayoutWithNav';
import ViewAllList from '../../../components/content/ViewAllList';
import Loader from '../../../components/app/Loader';
import { wrapper } from '../../../store';
import AuraContent from '../../../services/AuraContent';
import VIEW_ALL_CONTENT_TYPE_PAGES from '../../../data/pageContent/contentTypePageRows.json';
import { getTopicsOfTrackType } from '../../../models/topic';
import { filterActiveTracks, getMeditation } from '../../../models/meditation';
import { stripSpecialCharactersForURL } from '../../../utils/urlFormater';
import routeConstants from '../../../utils/constants/routes';

async function fetchPageData(params) {
  const { type, topic } = params;
  let title;
  let contentType;
  let pageContent = {};
  if (type === routeConstants.SLUG_MUSIC_AND_SOUNDS) {
    const musicTopics = await getTopicsOfTrackType('music');
    let topicFound;
    for (let index = 0; index < musicTopics.length; index++) {
      const singleTopic = musicTopics[index];
      const formatedTitle = stripSpecialCharactersForURL(singleTopic.title);
      if (formatedTitle === topic) {
        topicFound = true;
        const { content } = singleTopic;
        if (content) {
          title = `Music & Sounds: ${singleTopic.title}`;
          contentType = 'tracks';
          const dataPromises = [];
          // eslint-disable-next-line no-loop-func
          Object.keys(content).forEach((trackId) => {
            dataPromises.push(getMeditation(trackId));
          });
          // eslint-disable-next-line no-await-in-loop
          pageContent = await Promise.all(dataPromises);
          if (!pageContent) {
            return { error: 'Topic not found!' };
          }
          // eslint-disable-next-line no-await-in-loop
          pageContent = await filterActiveTracks(pageContent);
          if (!pageContent) {
            return { error: 'Tracks not found!' };
          }
          pageContent = { [topic]: pageContent };
          if (!pageContent) {
            return { error: 'Tracks not found!' };
          }
          return {
            title,
            contentType,
            pageContent,
            topic,
            type,
            topicKey: singleTopic.key,
          };
        }
      }
    }
    if (!topicFound) {
      return { error: 'Topic not found!' };
    }
  }
  const viewAllData = Object.values(VIEW_ALL_CONTENT_TYPE_PAGES).find(
    (data) => data.urlKey === type
  );
  if (!viewAllData) {
    return { error: 'Topic not found!' };
  }
  const viewAllTopics = Object.values(viewAllData.pageContent).find(
    (data) => data.viewAllPage === topic
  );
  if (!viewAllTopics) {
    return { error: 'Topic not found!' };
  }
  contentType = viewAllTopics.contentType;
  title = `${viewAllData.title}: ${viewAllTopics.title}`;
  const data = await AuraContent.fetchPageData({
    [topic]: viewAllTopics,
  });
  pageContent = data.pageContent;

  return {
    pageContent,
    contentType,
    title,
    topic,
    type,
  };
}

function ViewAllContentType(serverProps) {
  const { pageContent, title, topic, contentType, type, topicKey } =
    serverProps;
  const auraContent = Object.values(pageContent[topic]);
  useAllCoaches();
  return (
    <LayoutWithNav>
      <Head>
        <title>{`${title} - Aura`}</title>
        <meta
          name="description"
          content={`Explore ${title} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${title} - Aura`} />
        <meta
          property="og:description"
          content={`Explore ${title} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${type}/${topic}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${type}/${topic}`}
        />
      </Head>
      <div className="page">
        {!auraContent ? (
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
            <ViewAllList
              data={auraContent}
              label={contentType}
              topic={topicKey}
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
      if (props.error) {
        return { notFound: true };
      }

      await store.dispatch(setAppLocale(getISOLocale(locale)));

      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/[type]/[topic]',
        })),
      };
      return { props };
    }
);
export default ViewAllContentType;
