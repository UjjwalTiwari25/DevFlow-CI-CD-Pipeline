import React, { useState } from 'react';
import Head from 'next/head';
import BaseLayout from '../../../../layouts/BaseLayout';
import Error from '../../../../components/app/Error';
import InfluencerUserId from '../../../../components/page/influencer/dashboard/[userId]';

function GuestPass() {
  const [isInfluencer, setIsInfluencer] = useState(true);

  if (!isInfluencer) {
    return (
      <BaseLayout>
        <Error message={'Sorry, this page is exclusive to Aura Influencers'} />
      </BaseLayout>
    );
  }
  return (
    <BaseLayout>
      <Head>
        <title>{`Influencer Referral Dashboard`}</title>
        <meta
          name="description"
          content={`Share Aura with your friends & family. Help them sleep better and find peace with unlimited access to premium.`}
        />
        <meta property="og:title" content={`Influencer Referral Dashboard`} />
        <meta
          property="og:description"
          content={`Share Aura with your friends & family. Help them sleep better and find peace with unlimited access to premium.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <InfluencerUserId setIsInfluencer={setIsInfluencer} />
    </BaseLayout>
  );
}

export default GuestPass;
