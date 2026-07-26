import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import { isTestMode } from '@/utils';
import { wrapper } from '../../store';
import { getTopicsOfTrackType } from '../../models/topic';
import Loader from '../../components/app/Loader';
import CustomContent from '../../components/content/CustomContent';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import Text from '../../components/app/Text';
import AuraContent from '../../services/AuraContent';
import CONTENT_TYPE_ROWS from '../../data/pageContent/contentTypePageRows.json';
import { filterActiveTracks, getMeditation } from '../../models/meditation';
import dynamicSitemapLink from '../../../scripts/dynamicSitemapLink';
import { stripSpecialCharactersForURL } from '../../utils/urlFormater';
import routeConstants from '../../utils/constants/routes';
import useTrackPageView from '../../hooks/trackPageView';

function ContentType(serverProps) {
  const { pageContent, contentType, contentTypeRows } = serverProps;
  const { title, key, urlKey } = contentType;
  const router = useRouter();
  const path = router.asPath;
  useAllCoaches();
  useTrackPageView({
    Title: title,
    'Content Type Key': key,
  });
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>{`${title} Tracks - Aura`}</title>
        <meta
          name="description"
          content={`Listen to ${title} tracks and much more on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety.`}
        />
        <meta property="og:title" content={`${title} Tracks - Aura`} />
        <meta
          property="og:description"
          content={`Listen to ${title} tracks and much more on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${key}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${key}`}
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
            {Object.values(contentTypeRows).map((dataRow, index) => (
              <CustomContent
                key={dataRow.unique}
                pageContent={pageContent}
                rowData={dataRow}
                sectionIndex={index}
                showViewAllLink={
                  path.includes(routeConstants.SLUG_MUSIC_AND_SOUNDS)
                    ? true
                    : !!dataRow.viewAllPage
                }
                viewAllLink={
                  // eslint-disable-next-line no-nested-ternary
                  path.includes(routeConstants.SLUG_MUSIC_AND_SOUNDS)
                    ? `/${urlKey}/${stripSpecialCharactersForURL(
                        dataRow.title
                      )}`
                    : dataRow.contentType === 'tracks'
                      ? `/${routeConstants.PAGE_TOPICS}/${dataRow.viewAllPage}`
                      : `/${routeConstants.PAGE_CHANNELS}/${dataRow.viewAllPage}`
                }
              />
            ))}
          </div>
        )}
      </div>
    </LayoutWithNav>
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params, locale }) => {
      if (isTestMode()) {
        return { notFound: true };
      }
      let props = {};
      const contentType = Object.values(CONTENT_TYPE_ROWS).find(
        (item) => item.urlKey === params.type
      );
      if (!contentType) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));

      let contentTypeRows = contentType.pageContent;
      let pageContent = {};
      if (contentType.urlKey === routeConstants.SLUG_MUSIC_AND_SOUNDS) {
        contentTypeRows = {};
        const musicTopics = await getTopicsOfTrackType('music');
        for (let index = 0; index < musicTopics.length; index++) {
          const topic = musicTopics[index];
          const { key, title, content } = topic;
          if (content) {
            contentTypeRows[key] = {
              title,
              contentType: 'tracks',
              unique: key,
            };
            const dataPromises = [];
            Object.keys(content).forEach((trackId) => {
              dataPromises.push(getMeditation(trackId));
            });
            // eslint-disable-next-line no-await-in-loop
            let meditations = await Promise.all(dataPromises);
            // eslint-disable-next-line no-await-in-loop
            meditations = await filterActiveTracks(meditations);
            pageContent[key] = meditations;
          }
        }
      } else {
        const data = await AuraContent.fetchPageData(contentTypeRows);
        pageContent = data.pageContent;
      }
      props = {
        contentType,
        contentTypeRows,
        pageContent,
        ...(await I18N.loadLocale({
          locale,
          route: '/[type]',
        })),
      };
      return { props };
    }
);

export async function getStaticPaths() {
  const paths = [];
  const contentTypeSitemapPaths = [];
  const musicTopics = await getTopicsOfTrackType('music');
  Object.values(CONTENT_TYPE_ROWS).forEach((contentType) => {
    paths.push({ params: { type: contentType.urlKey } });
    contentTypeSitemapPaths.push({ params: { type: contentType.urlKey } });
    const contentTypeKey = contentType.urlKey;

    if (contentTypeKey === routeConstants.SLUG_MUSIC_AND_SOUNDS) {
      musicTopics.forEach((topic) => {
        const topicTitle = topic.title;
        const topicUrl = stripSpecialCharactersForURL(topicTitle);
        contentTypeSitemapPaths.push({
          params: { type: `${contentTypeKey}/${topicUrl}` },
        });
      });
    }
  });
  await dynamicSitemapLink({
    paths: contentTypeSitemapPaths,
    paramType: 'type',
  });
  return {
    paths,
    fallback: false,
  };
}

export default ContentType;
