import React from 'react';
import Head from 'next/head';
import BaseLayout from '../../layouts/BaseLayout';
import usePageQuery from '../../hooks/pageQuery';
import AmbassadorPage from '../../components/page/ambassador';

function GuestPass() {
  const { userId } = usePageQuery({ fetchUserFromQuery: true });
  return (
    <BaseLayout useAuth isUserFromQuery={!!userId}>
      <Head>
        <title>{`Share Aura and Earn Awesome Rewards`}</title>
        <meta
          name="description"
          content={`Share Aura with your friends and family to become an Aura ambassador and earn cool Aura merchandise`}
        />
        <meta
          property="og:title"
          content={`Share Aura and Earn Awesome Rewards`}
        />
        <meta
          property="og:description"
          content={`Share Aura with your friends and family to become an Aura ambassador and earn cool Aura merchandise`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AmbassadorPage />
    </BaseLayout>
  );
}

export default GuestPass;
