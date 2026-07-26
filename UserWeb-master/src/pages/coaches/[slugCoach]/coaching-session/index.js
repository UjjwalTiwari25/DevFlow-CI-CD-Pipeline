import React, { useState } from 'react';
import Head from 'next/head';
import useAllCoaches from '@/hooks/allCoaches';
import I18N from '@/services/I18N';
import { wrapper } from '../../../../store';
import { getCoachFromSlug } from '../../../../models/coach';
import routeConstants from '../../../../utils/constants/routes';
import BaseLayout from '../../../../layouts/BaseLayout';
import CoachingSession from '../../../../components/page/coaches/coachingSession';
import usePageQuery from '../../../../hooks/pageQuery';
import useCoachingSession from '../../../../hooks/coachingSession';
import useCoachProfileSignup from '../../../../hooks/coachProfileSignup';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import useCoachAvailability from '../../../../hooks/coachAvailability';

async function fetchPageData(query) {
  if (!query.slugCoach) {
    return {
      error: 'CoachId not found',
    };
  }
  const { slugCoach } = query;
  const coach = await getCoachFromSlug(slugCoach);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  return {
    coach,
  };
}

function CoachingSessions(serverProps) {
  const { coach } = serverProps;
  const { serviceId = null } = usePageQuery();
  const [limit, setLimit] = useState(7);

  const { allCoachService } = useCoachingSession(serviceId);
  const { selectedDuration } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );
  useAllCoaches();
  useCoachAvailability(limit, allCoachService?.coachId, {
    duration: selectedDuration,
    sessionTypeId: allCoachService?.sessionTypeId,
  });

  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'coaching-session',
    serviceId,
  });

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>{`1-1 coaching session by ${coach.name} - Aura`}</title>
        <meta
          name="description"
          content={`Book a 1-1 coaching session with ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          property="og:title"
          content={`1-1 coaching session by ${coach.name} - Aura`}
        />
        <meta
          property="og:description"
          content={`Book a 1-1 coaching session with ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="page">
        <CoachingSession
          coach={coach}
          onSubmitSignup={onSubmitSignup}
          setLimit={setLimit}
          limit={limit}
        />
      </div>
    </BaseLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  () => async (i) => {
    const { query, locale } = i;
    let props = await fetchPageData(query);
    if (props.error) {
      return { notFound: true };
    }
    props = {
      ...props,
      ...(await I18N.loadLocale({
        locale,
        route: '/coaches/[slugCoach]/coaching-session',
      })),
    };
    return { props };
  }
);
export default CoachingSessions;
