import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import BaseLayout from '../../../layouts/BaseLayout';
import routeConstants from '../../../utils/constants/routes';
import usePageQuery from '../../../hooks/pageQuery';
import { wrapper } from '../../../store';
import { getCoach, getCoachFromSlug } from '../../../models/coach';
import CoachingPlan from '../../../components/coaching-plan';

function YourPlan(serverProps) {
  const { coach } = serverProps;
  const { userId = null } = usePageQuery({ fetchUserFromQuery: true });
  return (
    <BaseLayout useAuth isUserFromQuery={!!userId} hideFooterBackground={false}>
      <Head>
        <title>Your personal plan - Aura</title>
        <meta property="og:title" content="Your personal plan - Aura" />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content="Personalized Meditation Recommendations, World's Top Experts, Exclusive Content, Easy self-care anytime on Aura mobile app and much more."
        />
        <meta
          property="og:description"
          content="Personalized Meditation Recommendations, World's Top Experts, Exclusive Content, Easy self-care anytime on Aura mobile app and much more."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_YOUR_PLAN}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <CoachingPlan coach={coach} />
    </BaseLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ params, res, locale }) => {
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${60 * 60 * 24}, stale-while-revalidate=${
          60 * 60 * 24
        }`
      );
      const { slugCoach } = params;
      let coach = await getCoachFromSlug(slugCoach);
      if (!coach) {
        // If coach not found by slug, check if coach exists by id
        coach = await getCoach(slugCoach);
      }
      // If coach not found or coaching not enabled for coach return 404
      if (!coach || !coach.coachingEnabledAt) {
        return { notFound: true };
      }
      const props = {
        coach,
        ...(await I18N.loadLocale({
          locale,
          route: '/coaching-plan/[slugCoach]',
        })),
      };
      return { props };
    }
);

export default YourPlan;
