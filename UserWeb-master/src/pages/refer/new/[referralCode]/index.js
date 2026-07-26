import React from 'react';
import useNewLandingPageStyle from '@/hooks/useNewLandingPageStyle';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { getReferralDetails } from '@/hooks/referral';
import referralConstants from '@/utils/constants/referral';
import useTrackPageView from '@/hooks/trackPageView';
import usePageQuery from '@/hooks/pageQuery';
import useTranslations from '@/hooks/translations';
import BaseLayout from '../../../../layouts/BaseLayout';
import NewReferReferralCode from '../../../../components/page/refer/new/[referralCode]';

function NewRefer({ referral }) {
  const { t } = useTranslations();
  const { referrer } = referral;
  const {
    referralCode = null,
    referralType = referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL,
    utm_source = referralConstants.SOURCE_USER_REFERRAL,
    utm_medium,
    channel = null,
  } = usePageQuery();

  useTrackPageView(
    {
      ReferralCode: referralCode,
      ReferralType: referralType,
      Medium: utm_medium,
      Channel: channel,
      Source: utm_source,
      ReferrerId: referrer?.id,
    },
    [referralCode]
  );

  useNewLandingPageStyle({ includeScripts: true });

  return (
    <BaseLayout hideFooterBackground hideBackgroundImages>
      <Head>
        <title>{t('referral_meta_title', { trial: 30 })}</title>
        <meta
          name="description"
          content={t('referral_meta_description', { trial: 30 })}
        />
        <meta
          property="og:title"
          content={t('referral_meta_title', { trial: 30 })}
        />
        <meta
          property="og:description"
          content={t('referral_meta_description', { trial: 30 })}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/referNew/guest-pass.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NewReferReferralCode referral={referral} />
    </BaseLayout>
  );
}

export const getServerSideProps = async ({ params, locale }) => {
  const { referralCode } = params;
  const referral = await getReferralDetails({
    referralCode,
    referralType: referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL,
  });

  const { referrer, error } = referral;

  if (!referrer || error) {
    return { notFound: true };
  }
  return {
    props: {
      referral,
      ...(await I18N.loadLocale({
        locale,
        route: '/refer/new/[referralCode]',
      })),
    },
  };
};

export default NewRefer;
