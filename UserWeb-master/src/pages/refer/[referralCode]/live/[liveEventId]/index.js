import React from 'react';
import Head from 'next/head';
import { wrapper } from '@/store';
import LiveReferralPage from '@/components/page/refer/live/[liveEventId]';
import usePageQuery from '@/hooks/pageQuery';
import useReferralAuthListener from '@/hooks/useReferralAuthListener';
import useTrackPageView from '@/hooks/trackPageView';
import { getLiveEvent, getLiveMetaImages } from '@/models/live';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { setAppLocale } from '@/store/slices/app';
import { setCoachDetailsAction, getCoachDetails } from '@/store/slices/coaches';
import referralConstants from '@/utils/constants/referral';
import useExperiments from '@/hooks/experiments';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import { setLiveEventAction } from '@/store/slices/live';
import Loader from '@/components/app/Loader';
import { getISOLocale } from '@/models/locale';
import { getReferralDetails } from '@/hooks/referral';
import BaseLayout from '../../../../../layouts/BaseLayout';

const EXPERIMENTS = ['removeNameReferralSignup'];

function LiveReferral({ coach, liveEventDetails, ogImage, referral }) {
  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  const { t } = useTranslations();
  const pageQuery = usePageQuery();
  const { referrer } = referral;
  const {
    utm_campaign = referralConstants.SOURCE_LIVE_EVENT_REFERRAL,
    utm_source = referralConstants.SOURCE_LIVE_EVENT_REFERRAL,
    utm_medium = null,
    referralCode = null,
    referralType = referrer?.referralType,
    channel = null,
    liveEventId,
  } = pageQuery;

  const onAuthChange = useReferralAuthListener({
    experiments,
    referralType,
    referralCode,
    referrer,
    type: referralConstants.SOURCE_LIVE_EVENT_REFERRAL,
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
      Medium: utm_medium,
      Channel: channel,
      LiveEventId: liveEventId,
      Source: utm_source,
      ReferrerId: referrer?.id,
    },
    [referralCode, liveEventDetails]
  );

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>
          {t('referral_live_meta_title', { liveTitle: liveEventDetails.title })}
        </title>
        <meta
          name="description"
          content={t('referral_live_meta_description', {
            liveTitle: liveEventDetails.title,
          })}
        />
        <meta
          property="og:title"
          content={t('referral_live_meta_title', {
            liveTitle: liveEventDetails.title,
          })}
        />
        <meta
          property="og:description"
          content={t('referral_live_meta_description', {
            liveTitle: liveEventDetails.title,
          })}
        />
        <meta property="og:image" content={`${ogImage}`} />

        {/* <meta property="og:image:width" content="630" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image" content={`${ogImage}`} /> */}

        {/* <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content={`${ogImageLandScape}`} /> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NewLandingPageStyle />{' '}
      {!isExperimentsAssigned ? (
        <Loader />
      ) : (
        <LiveReferralPage
          referralCode={referralCode}
          referralType={referralType}
          utm_source={utm_source}
          utm_campaign={utm_campaign}
          utm_medium={utm_medium}
          channel={channel}
          experiments={experiments}
          referral={referral}
          isExperimentsAssigned={isExperimentsAssigned}
        />
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      const { liveEventId, referralCode } = params;
      store.dispatch(setAppLocale(getISOLocale(locale)));
      const liveEventResponse = await getLiveEvent(liveEventId);

      if (!liveEventResponse) {
        return { notFound: true };
      }
      await store.dispatch(setLiveEventAction(liveEventResponse));

      const { coachId } = liveEventResponse || {};
      const coach = await store.dispatch(getCoachDetails(coachId)).unwrap();
      if (!coach) {
        return { notFound: true };
      }

      const metaImages = await getLiveMetaImages(liveEventResponse, coach);

      await store.dispatch(setCoachDetailsAction(coach));

      const referral = await getReferralDetails({
        referralCode,
        getReferralType: (referrer) =>
          referrer?.id === coachId
            ? referralConstants.COACH_SUBSCRIPTION_30TRIAL
            : referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL,
      });
      const { referrer } = referral;
      if (!referrer) {
        return { notFound: true };
      }

      return {
        props: {
          coach,
          liveEventDetails: liveEventResponse,
          ...metaImages,
          referral,
          ...(await I18N.loadLocale({
            locale,
            route: '/refer/[referralCode]/live/[liveEventId]',
          })),
        },
      };
    }
);

export default LiveReferral;
