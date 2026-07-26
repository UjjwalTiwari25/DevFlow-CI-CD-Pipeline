import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import { isTestMode } from '@/utils';
import AuraContent from '../../services/AuraContent';
import { wrapper } from '../../store';
import HOME_DATA_ROWS from '../../data/pageContent/homePageRows.json';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import routeConstants from '../../utils/constants/routes';
import { getTopicCategories } from '../../models/topic';
import HomePage from '../../components/page/aura';

function Home(serverProps) {
  const { pageContent, homePageRows } = serverProps;
  useAllCoaches();
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>
          Aura - #1 App for Mindfulness Meditation, Sleep, & Emotional Health
        </title>
        <meta
          name="description"
          content="Aura is the #1 app for guided meditations, stories and life coaching to improve sleep and reduce anxiety. Join millions for better sleep and mindfulness."
        />
        <meta
          property="og:title"
          content="Aura - #1 App for Mindfulness Meditation, Sleep, & Emotional Health"
        />
        <meta
          property="og:description"
          content="Aura is the #1 app for guided meditations, stories and life coaching to improve sleep and reduce anxiety. Join millions for better sleep and mindfulness."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_AURA}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_AURA}`}
        />
      </Head>
      <HomePage pageContent={pageContent} homePageRows={homePageRows} />
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

      const categories = await getTopicCategories();
      const homePageRows = HOME_DATA_ROWS;
      Object.keys(categories).forEach((categoryKey) => {
        const homePageRow = homePageRows[categoryKey];
        const category = categories[categoryKey];
        const { key, title, slug } = category;
        if (homePageRow) {
          homePageRows[categoryKey] = {
            ...homePageRow,
            query: { topicCategory: key, limit: 16, shuffle: true },
            unique: key,
            title,
            viewAllPage: slug,
          };
        } else {
          delete homePageRows[categoryKey];
        }
      });
      let props = await AuraContent.fetchPageData(homePageRows);
      props.homePageRows = homePageRows;
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/aura',
        })),
      };
      return { props };
    }
);

export default Home;
