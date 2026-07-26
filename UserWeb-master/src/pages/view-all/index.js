import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import I18N from '@/services/I18N';
import Text from '../../components/app/Text';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import ViewAllList from '../../components/content/ViewAllList';
import useShallowEqualSelector from '../../hooks/shallowEqualSelector';
import routeConstants from '../../utils/constants/routes';
import Loader from '../../components/app/Loader';

function ViewAll() {
  const { data, selectedRow, rowLabel } = useShallowEqualSelector(
    ({ viewAll }) => viewAll
  );

  useEffect(() => {
    if (!data || !data.length) {
      Router.push(`/`);
    }
  }, [data]);
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>{`${selectedRow} - Aura`}</title>
        <meta
          name="description"
          content={`Explore ${selectedRow} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${selectedRow} - Aura`} />
        <meta
          property="og:description"
          content={`Explore ${selectedRow} and much more on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_VIEW_ALL}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div className="page">
        {!data || !data.length ? (
          <Loader />
        ) : (
          <div className="content-padding">
            <Text
              type="h2"
              component="h1"
              color="b100"
              style={{ marginBottom: 24 }}>
              {selectedRow}
            </Text>
            <ViewAllList
              data={data}
              label={rowLabel}
              selectedRow={selectedRow}
            />
          </div>
        )}
      </div>
    </LayoutWithNav>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await I18N.loadLocale({ locale, route: '/view-all' })),
    },
  };
};

export default ViewAll;
