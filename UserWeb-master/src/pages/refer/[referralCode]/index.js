import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import BaseLayout from '../../../layouts/BaseLayout';
import ReferReferralCode from '../../../components/page/refer/[referralCode]';

function Refer() {
  return (
    <BaseLayout>
      <Head>
        <title>{`30 Day Guest Pass - Aura`}</title>
        <meta
          name="description"
          content={`Join Aura now and claim your 30-Day Guest Pass`}
        />
        <meta property="og:title" content={`30 Day Guest Pass - Aura`} />
        <meta
          property="og:description"
          content={`Join Aura now and claim your 30-Day Guest Pass`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/guestpass.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <ReferReferralCode />
    </BaseLayout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await I18N.loadLocale({ locale, route: '/refer/[referralCode]' })),
    },
  };
};

export default Refer;
