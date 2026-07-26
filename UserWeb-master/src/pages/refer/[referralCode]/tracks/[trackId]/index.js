import React from 'react';
import Head from 'next/head';
import { wrapper } from '@/store';
import Loader from '@/components/app/Loader';
import TrackReferrralPage from '@/components/page/refer/track/[trackId]';
import usePageQuery from '@/hooks/pageQuery';
import useReferralAuthListener from '@/hooks/useReferralAuthListener';
import useTrackPageView from '@/hooks/trackPageView';
import { getMeditation, getTrackMetaImages } from '@/models/meditation';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { setAppLocale } from '@/store/slices/app';
import { setCoachDetailsAction, getCoachDetails } from '@/store/slices/coaches';
import referralConstants from '@/utils/constants/referral';
import { validateTrackSlug } from '@/utils/validators';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import useExperiments from '@/hooks/experiments';
import { getISOLocale } from '@/models/locale';
import { getReferralDetails } from '@/hooks/referral';
import BaseLayout from '../../../../../layouts/BaseLayout';

const EXPERIMENTS = ['removeNameReferralSignup'];

function TrackReferral({ coach, track, ogImage, referral }) {
  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  const { t } = useTranslations();
  const pageQuery = usePageQuery();
  const { referrer } = referral;
  const {
    utm_campaign = referralConstants.SOURCE_CONTENT_REFERRAL,
    utm_source = referralConstants.SOURCE_CONTENT_REFERRAL,
    utm_medium = null,
    referralCode = null,
    referralType = referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
      ? null
      : referralConstants.COACH_SUBSCRIPTION_30TRIAL,
    channel = null,
    trackId,
  } = pageQuery;

  const onAuthChange = useReferralAuthListener({
    experiments,
    referralType,
    referralCode,
    type: referralConstants.SOURCE_CONTENT_REFERRAL,
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
      TrackId: trackId,
      Source: utm_source,
      ReferrerId: referrer?.id,
    },
    [referralCode, track]
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
          {t('referral_track_meta_title', { trackName: track.title })}
        </title>
        <meta
          name="description"
          content={t('referral_track_meta_description', {
            trackName: track.title,
          })}
        />
        <meta
          property="og:title"
          content={t('referral_track_meta_title', { trackName: track.title })}
        />
        <meta
          property="og:description"
          content={t('referral_track_meta_description', {
            trackName: track.title,
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
      <NewLandingPageStyle />
      {!isExperimentsAssigned ? (
        <Loader />
      ) : (
        <TrackReferrralPage
          track={track}
          referralCode={referralCode}
          referralType={referralType}
          utm_source={utm_source}
          utm_campaign={utm_campaign}
          utm_medium={utm_medium}
          channel={channel}
          experiments={experiments}
          isExperimentsAssigned={isExperimentsAssigned}
          referral={referral}
        />
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      const { trackId, referralCode } = params;

      // Validate the trackId
      if (!validateTrackSlug(trackId).isValid) {
        return { notFound: true };
      }

      store.dispatch(setAppLocale(getISOLocale(locale)));
      const trackResponse = await getMeditation(trackId);

      if (!trackResponse) {
        return { notFound: true };
      }
      const { userId: coachId } = trackResponse || {};

      const referral = await getReferralDetails({
        referralCode,
        referralType:
          referralCode === referralConstants.REFER_CODE_AURA_SOCIAL
            ? referralConstants.TYPE_USER_SUBSCRIPTION_30TRIAL
            : referralConstants.COACH_SUBSCRIPTION_30TRIAL,
        allowAuraSocial: true,
      });

      const { referrer, error } = referral;
      const { id: referrerId } = referrer || {};

      if (
        !referrer ||
        error ||
        (coachId !== referrerId &&
          referralCode !== referralConstants.REFER_CODE_AURA_SOCIAL)
      ) {
        return { notFound: true };
      }

      const coach = await store.dispatch(getCoachDetails(coachId)).unwrap();

      if (!coach) {
        return { notFound: true };
      }

      store.dispatch(setCoachDetailsAction(coach));
      const metaImages = await getTrackMetaImages(trackResponse, coach);

      return {
        props: {
          coach,
          track: trackResponse,
          referral,
          ...metaImages,
          ...(await I18N.loadLocale({
            locale,
            route: '/refer/[referralCode]/tracks/[trackId]',
          })),
        },
      };
    }
);

export default TrackReferral;
