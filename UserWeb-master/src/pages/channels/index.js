import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { isTestMode } from '@/utils';
import Loader from '../../components/app/Loader';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import Text from '../../components/app/Text';
import { wrapper } from '../../store';
import CHANNELS_DATA_ROWS from '../../data/pageContent/channelsPageRows.json';
import AuraContent from '../../services/AuraContent';
import CustomContent from '../../components/content/CustomContent';
import routeConstants from '../../utils/constants/routes';
import useTrackPageView from '../../hooks/trackPageView';

function Channels(serverProps) {
  const { pageContent } = serverProps;
  useTrackPageView();
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>Channels by our Coaches - Aura</title>
        <meta
          name="description"
          content="Explore the many coach channels on Aura and listen to the guided meditations, stories, and life coaching tracks for better sleep, lower stress, and less anxiety."
        />
        <meta property="og:title" content="Channels by our Coaches - Aura" />
        <meta
          property="og:description"
          content="Explore the many coach channels on Aura and listen to the guided meditations, stories, and life coaching tracks for better sleep, lower stress, and less anxiety."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHANNELS}`}
        />
      </Head>
      <div className="page">
        {!pageContent ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              Channels
            </Text>
            {Object.values(CHANNELS_DATA_ROWS).map((dataRow, index) => (
              <CustomContent
                key={dataRow.unique}
                pageContent={pageContent}
                sectionIndex={index}
                rowData={dataRow}
                viewAllLink={`/${routeConstants.PAGE_CHANNELS}/${dataRow.viewAllPage}`}
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
    async ({ locale }) => {
      if (isTestMode()) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      let props = await AuraContent.fetchPageData(CHANNELS_DATA_ROWS);
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/channels',
        })),
      };
      return { props };
    }
);

export default Channels;
