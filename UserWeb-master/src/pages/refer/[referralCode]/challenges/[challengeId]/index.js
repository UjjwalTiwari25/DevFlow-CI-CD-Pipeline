import React from 'react';
import Head from 'next/head';
import { wrapper } from '@/store';
import ChallangeReferralPage from '@/components/page/refer/challenges/[referralCode]';
import usePageQuery from '@/hooks/pageQuery';
import { getChallengeDetails } from '@/models/challenges';
import { getCoach } from '@/models/coach';
import useReferralAuthListener from '@/hooks/useReferralAuthListener';
import useTrackPageView from '@/hooks/trackPageView';
import I18N from '@/services/I18N';
import referralConstants from '@/utils/constants/referral';
import useExperiments from '@/hooks/experiments';
import NewLandingPageStyle from '@/components/newLandingPageContent/NewLandingPageStyle';
import config from '@/config';
import { format } from 'date-fns';
import Loader from '@/components/app/Loader';
import useTranslations from '@/hooks/translations';
import { getReferralDetails } from '@/hooks/referral';
import BaseLayout from '../../../../../layouts/BaseLayout';

const EXPERIMENTS = ['removeNameReferralSignup'];

function NewRefer({ challenge, coach, referral }) {
  const [experiments] = useExperiments(EXPERIMENTS, null);
  const isExperimentsAssigned =
    !EXPERIMENTS.length || !!Object.values(experiments).length;
  const { referrer } = referral;

  const pageQuery = usePageQuery();
  const { t } = useTranslations();
  const {
    utm_campaign = referralConstants.SOURCE_CHALLENGES_REFERRAL,
    utm_source = referralConstants.SOURCE_CHALLENGES_REFERRAL,
    utm_medium = null,
    referralType = referralConstants.TYPE_CHALLENGES_SUBSCRIPTION_30TRIAL,
    referralCode = null,
    channel = null,
    challengeId,
  } = pageQuery;

  const metaOgImage = challenge.ogImage;
  const onAuthChange = useReferralAuthListener({
    experiments,
    referralType,
    referralCode,
    type: referralConstants.SOURCE_CHALLENGES_REFERRAL,
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
      ChallengeId: challengeId,
      Source: utm_source,
      ReferrerId: referrer?.id,
    },
    [referralCode, challenge]
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
          {t('meta_challenge_referral_title', {
            challengeName: challenge.name,
          })}
        </title>
        <meta
          name="description"
          content={t('meta_challenge_referral_description')}
        />
        <meta
          property="og:title"
          content={t('meta_challenge_referral_title', {
            challengeName: challenge.name,
          })}
        />
        <meta
          property="og:description"
          content={t('meta_challenge_referral_description')}
        />

        <meta property="og:image" content={`${metaOgImage}`} itemProp="image" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <NewLandingPageStyle />
      {!isExperimentsAssigned ? (
        <Loader />
      ) : (
        <ChallangeReferralPage
          referral={referral}
          challenge={challenge}
          loading={!isExperimentsAssigned}
          experiments={experiments}
          referralCode={referralCode}
          referralType={referralType}
          utm_source={utm_source}
          utm_campaign={utm_campaign}
          utm_medium={utm_medium}
          channel={channel}
        />
      )}
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params, locale }) => {
      const { challengeId, referralCode } = params;

      const referral = await getReferralDetails({
        referralCode,
        referralType: referralConstants.TYPE_CHALLENGES_SUBSCRIPTION_30TRIAL,
      });

      const { referrer, error } = referral;

      if (!referrer || error) {
        return { notFound: true };
      }
      const challengeResponse = await getChallengeDetails(challengeId);

      if (!challengeResponse) {
        return { notFound: true };
      }

      const coach = await getCoach(referrer?.id);

      const challegeReferOgImageUrl = new URL(
        `${config.appDomain}/api/og/challengeRefer`
      );
      challegeReferOgImageUrl.searchParams.append(
        'referrerName',
        referrer.givenName
      );
      challegeReferOgImageUrl.searchParams.append(
        'challengeName',
        challengeResponse.name
      );
      challegeReferOgImageUrl.searchParams.append(
        'duration',
        challengeResponse?.tracks?.length
      );
      challegeReferOgImageUrl.searchParams.append(
        'cardImage',
        challengeResponse?.cardImage
      );
      if (new Date(challengeResponse.startDate) >= new Date()) {
        challegeReferOgImageUrl.searchParams.append(
          'startDate',
          format(new Date(challengeResponse.startDate), 'dd MMM yyyy')
        );
      }

      const ogImage = challegeReferOgImageUrl.toString();
      challegeReferOgImageUrl.searchParams.append('landScapeImage', true);
      const ogImageLandScape = challegeReferOgImageUrl.toString();
      return {
        props: {
          challenge: {
            ...challengeResponse,
            ogImage,
            ogImageLandScape,
          },
          coach,
          referral,
          ...(await I18N.loadLocale({
            locale,
            route: '/refer/[referralCode]/challenges/[challengeId]',
          })),
        },
      };
    }
);

export default NewRefer;
