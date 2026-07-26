import React from 'react';
import Head from 'next/head';
import useTheme, { THEMES } from '@/hooks/theme';
import ChallengesPage from '@/components/page/challenges/[challengeId]';
import { getChallengeDetails } from '@/models/challenges';
import BaseLayout from '../../../layouts/BaseLayout';
import routeConstants from '../../../utils/constants/routes';
import { wrapper } from '../../../store';

export default function ChallengePage({ challenge }) {
  useTheme(THEMES.LIGHT);
  return (
    <BaseLayout>
      <Head>
        <title>{`${challenge.name} Challenge - Aura`}</title>
        <meta
          property="og:title"
          content={`${challenge.name} Challenge - Aura`}
        />
        <meta property="og:description" content={challenge.description} />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          itemProp="image"
          property="og:image"
          content={challenge.bannerImage}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_CHALLENGES}/${challenge.key}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <ChallengesPage challenge={challenge} />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params }) => {
      const { challengeId } = params;
      const props = {};
      const challenge = await getChallengeDetails(challengeId);
      if (!challenge) {
        return { notFound: true };
      }
      props.challenge = challenge;
      return { props };
    }
);
