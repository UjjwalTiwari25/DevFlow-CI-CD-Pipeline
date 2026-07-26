import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { wrapper } from '../../../../store';
import routeConstants from '../../../../utils/constants/routes';
import BaseLayout from '../../../../layouts/BaseLayout';
import usePageQuery from '../../../../hooks/pageQuery';
import { setUTM } from '../../../../store/slices/payment';
import { getLiveEvent } from '../../../../models/live';
import useCoachProfileSignup from '../../../../hooks/coachProfileSignup';
import LiveCoachingReply from '../../../../components/page/liveCoachingReplay';
import { getCoach } from '../../../../models/coach';

async function fetchPageData(query) {
  const { liveEventId } = query;

  if (!liveEventId) {
    return {
      error: 'live event id not found',
    };
  }
  const liveEvent = await getLiveEvent(liveEventId);
  if (!liveEvent || liveEvent.error) {
    return {
      error: 'Live event not found',
    };
  }
  const coach = await getCoach(liveEvent.coachId);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  return {
    liveEvent,
    coach,
    liveEventId,
  };
}

function ReplayLiveCoachingSessions(serverProps) {
  const { coach, liveEvent, liveEventId } = serverProps;

  const dispatch = useDispatch();
  const {
    campaign = null,
    utm_source = null,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
  } = usePageQuery({
    fetchUserFromQuery: true,
  });

  useEffect(() => {
    dispatch(
      setUTM({
        attribution: utm_source,
        campaign: utm_campaign || campaign,
        medium: utm_medium,
        content: utm_content,
      })
    );
  }, [
    campaign,
    dispatch,
    utm_campaign,
    utm_content,
    utm_medium,
    utm_source,
    liveEvent,
  ]);

  const { profilePicture } = coach || {};
  const { title } = liveEvent;
  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'live-event-replay',
    liveEventId,
  });

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>{`${title} - Live session on Aura`}</title>
        <meta
          name="description"
          content={`Replay live video session by ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${title} - Live session on Aura`} />
        <meta
          property="og:description"
          content={`Replay live video session by ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta itemProp="image" property="og:image" content={profilePicture} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_LIVE}/${liveEventId}/replay`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_LIVE}/${liveEventId}/${routeConstants.PAGE_LIVE_REPLAY}`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="page">
        <LiveCoachingReply
          coach={coach}
          liveEvent={liveEvent}
          onSubmitSignup={onSubmitSignup}
        />
      </div>
    </BaseLayout>
  );
}
export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async ({ query }) => {
      const props = await fetchPageData(query);
      if (props.error) {
        return { notFound: true };
      }
      return { props };
    }
);

export default ReplayLiveCoachingSessions;
