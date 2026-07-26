import FaqDeleteAccountPage from '@/components/page/faqDeleteAccountPage';
import BaseLayout from '@/layouts/BaseLayout';
import routeConstants from '@/utils/constants/routes';
import Head from 'next/head';
import React from 'react';

function FaqDeleteAccount() {
  return (
    <BaseLayout hideFooterBackground>
      <Head>
        <title>Frequently asked questions to delete account - Aura</title>
        <meta
          property="og:title"
          content="Frequently asked questions to delete account - Aura"
        />
        <meta
          property="og:description"
          content="Download Aura, the world's best app for guided meditations, stories, and life coaching, and join the millions experiencing better sleep, lower stress, and less anxiety."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_FAQ_DELETE_ACCOUNT}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <FaqDeleteAccountPage />
    </BaseLayout>
  );
}

export default FaqDeleteAccount;
