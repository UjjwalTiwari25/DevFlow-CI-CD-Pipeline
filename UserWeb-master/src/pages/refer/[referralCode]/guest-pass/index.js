import React from 'react';
import Head from 'next/head';
import { wrapper } from '@/store';
import GuestPassReferrralPage from '@/components/page/refer/guestPass/indes';
import usePageQuery from '@/hooks/pageQuery';
import useReferralAuthListener from '@/hooks/useReferralAuthListener';
import useTrackPageView from '@/hooks/trackPageView';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { setAppLocale } from '@/store/slices/app';
import Loader from '@/components/app/Loader';
import referralConstants from '@/utils/constants/referral';
import useExperiments from '@/hooks/experiments';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import { getISOLocale, getLocaleImage } from '@/models/locale';
import { getReferralDetails } from '@/hooks/referral';
import { getCoachDetails, setCoachDetailsAction } from '@/store/slices/coaches';
import appConstants from '@/utils/constants/app';
import BaseLayout from '../../../../layouts/BaseLayout';

const EXPERIMENTS = ['removeNameReferralSignup'];

function GuestPassReferral({ coach, referral }) {
  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  const { currentLocale, t } = useTranslations();
  const pageQuery = usePageQuery();
  const {
    utm_campaign = referralConstants.SOURCE_GUEST_PASS_REFERRAL,
    utm_source = referralConstants.SOURCE_GUEST_PASS_REFERRAL,
    utm_medium = null,
    referralCode = null,
    referralType = referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
      ? null
      : referralConstants.COACH_SUBSCRIPTION_30TRIAL,
    channel = null,
  } = pageQuery;
  const { referrer } = referral;

  const onAuthChange = useReferralAuthListener({
    experiments,
    referralType,
    referralCode,
    referrer,
    type: referralConstants.SOURCE_GUEST_PASS_REFERRAL,
    utm_campaign,
    utm_source,
    utm_medium,
  });

  useTrackPageView(
    {
      'Coach ID': coach?.id,
      'Coach Name': coach?.name,
      ReferralCode: referralCode,
      ReferralType: referralType,
      Source: utm_source,
      Medium: utm_medium,
      Channel: channel,
      ReferrerId: referrer?.id,
    },
    [referralCode]
  );

  const metaTitle = t('meta_guestpass_title', {
    count: 30,
  });

  const metaDescription = t('meta_guestpass_description', {
    count: 30,
  });

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={getLocaleImage(
            `${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/referNew/guest-pass.png`,
            currentLocale
          )}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {currentLocale === appConstants.DEFAULT_LOCALE && <NewLandingPageStyle />}
      {!isExperimentsAssigned ? (
        <Loader />
      ) : (
        <GuestPassReferrralPage
          referral={referral}
          referralCode={referralCode}
          referralType={referralType}
          utm_source={utm_source}
          utm_campaign={utm_campaign}
          utm_medium={utm_medium}
          channel={channel}
          experiments={experiments}
          isExperimentsAssigned={isExperimentsAssigned}
        />
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      const { referralCode } = params;
      store.dispatch(setAppLocale(getISOLocale(locale)));

      const referral = await getReferralDetails({
        referralCode,
        referralType: referralConstants.COACH_SUBSCRIPTION_30TRIAL,
        allowAuraSocial: true,
      });
      const { referrer } = referral;

      if (!referrer) {
        return { notFound: true };
      }
      const coach = await store.dispatch(getCoachDetails(referrer.id)).unwrap();
      if (!coach && referralCode !== referralConstants.REFER_CODE_AURA_SOCIAL) {
        return { notFound: true };
      }
      await store.dispatch(setCoachDetailsAction(coach));

      return {
        props: {
          coach,
          referral,
          ...(await I18N.loadLocale({
            locale,
            route: '/refer/[referralCode]/guest-pass',
          })),
        },
      };
    }
);

export default GuestPassReferral;
