import React, { useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import I18N from '@/services/I18N';
import useAllCoaches from '@/hooks/allCoaches';
import { wrapper } from '../../../../store';
import { getCoachFromSlug } from '../../../../models/coach';
import routeConstants from '../../../../utils/constants/routes';
import BaseLayout from '../../../../layouts/BaseLayout';
import LiveCoaching from '../../../../components/page/coaches/live';
import usePageQuery from '../../../../hooks/pageQuery';
import { setUTM } from '../../../../store/slices/payment';
import { getLiveEvent, getLiveMetaImages } from '../../../../models/live';
import useCoachProfileSignup from '../../../../hooks/coachProfileSignup';

async function fetchPageData(query) {
  const { slugCoach, liveEventId } = query;
  if (!slugCoach) {
    return {
      error: 'CoachId not found',
    };
  }
  if (!liveEventId) {
    return {
      error: 'live event id not found',
    };
  }
  const coach = await getCoachFromSlug(slugCoach);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  const liveEvent = await getLiveEvent(liveEventId);
  if (!liveEvent || liveEvent.error || liveEvent?.coachId !== coach?.id) {
    return {
      error: 'Live event not found',
    };
  }

  const metaImages = getLiveMetaImages(liveEvent, coach);

  return {
    coach,
    liveEvent,
    ...metaImages,
  };
}

function LiveCoachingSessions(serverProps) {
  const { coach, liveEvent, ogImageLandScape, ogImage } = serverProps;
  const dispatch = useDispatch();
  useAllCoaches();
  const {
    liveEventId = null,
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

  const { title } = liveEvent;
  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'coaching-live-event',
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
          content={`Reserve your spot for live video session by ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />
        <meta property="og:title" content={`${title} - Live session on Aura`} />
        <meta
          property="og:description"
          content={`Reserve your spot for live video session by ${coach.name} on Aura, the world's best app for guided meditations, stories, and life coaching for better sleep, lower stress, and less anxiety.`}
        />

        <meta property="og:image" content={`${ogImageLandScape}`} />

        <meta property="og:image:width" content="630" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image" content={`${ogImage}`} />

        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image" content={`${ogImageLandScape}`} />

        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/live?liveEventId=${liveEventId}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="page">
        <LiveCoaching
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
    async ({ query, locale }) => {
      let props = await fetchPageData(query);
      if (props.error) {
        return { notFound: true };
      }

      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/coaches/[slugCoach]/live',
        })),
      };
      return { props };
    }
);

export default LiveCoachingSessions;
