import React from 'react';
import Head from 'next/head';
import BaseLayout from '../../../layouts/BaseLayout';
import PageComponent from '../../../components/page/ambassador/[userId]';

function GuestPass() {
  return (
    <BaseLayout>
      <Head>
        <title>{`Ambassador Program Dashboard`}</title>
        <meta
          name="description"
          content={`Share Aura with your friends & family and earn Aura-branded rewards`}
        />
        <meta property="og:title" content={`Ambassador Program Dashboard`} />
        <meta
          property="og:description"
          content={`Share Aura with your friends & family and earn Aura-branded rewards`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <PageComponent />
    </BaseLayout>
  );
}

export default GuestPass;
