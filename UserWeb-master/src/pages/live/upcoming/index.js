import React, { useState } from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import BaseLayout from '../../../layouts/BaseLayout';
import routeConstants from '../../../utils/constants/routes';
import UpComingPage from '../../../components/page/upcoming';
import { getCoachLiveEvents } from '../../../models/live';
import Loader from '../../../components/app/Loader';
import useCoachProfileSignup from '../../../hooks/coachProfileSignup';
import { wrapper } from '../../../store';

export default function Upcoming(serverSideProps) {
  const { liveEvents } = serverSideProps;
  const [coachDetails, setCoachDetails] = useState(null);
  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coachDetails, {
    installSource: 'live-view-all',
  });

  if (!liveEvents) {
    return <Loader />;
  }
  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      onAuthChange={onAuthChange}
      allowSignup>
      <Head>
        <title>Aura Live Upcoming Events</title>
        <meta property="og:title" content="Aura Live Upcoming Events" />
        <meta
          property="og:description"
          content="View all the upcoming live events from all the coaches on Aura, the world's best app for guided meditations, stories, and life coaching for stress, sleep, anxiety, and much more."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_LIVE}/${routeConstants.PAGE_UPCOMING}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <UpComingPage
        liveEvents={liveEvents}
        setCoachDetails={setCoachDetails}
        coachDetails={coachDetails}
        onSubmitSignup={onSubmitSignup}
      />
    </BaseLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ locale }) => {
      const liveEvents = await getCoachLiveEvents();
      if (!liveEvents || liveEvents.error) {
        return { notFound: true };
      }

      return {
        props: {
          liveEvents,
          ...(await I18N.loadLocale({
            locale,
            route: '/live/upcoming',
          })),
        },
      };
    }
);
