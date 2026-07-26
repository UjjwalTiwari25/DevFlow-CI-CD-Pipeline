import React from 'react';
import Head from 'next/head';
import { getAllEventCoaches, getEventFromSlug } from '@/models/event';
import I18N from '@/services/I18N';
import { getCoach, getCoachFromSlug } from '@/models/coach';
import { getCommunityByIdFromDatabase } from '@/models/community';
import Event from '@/components/page/coaches/[slugEvent]';
import useTranslations from '@/hooks/translations';
import { wrapper } from '../../../../../store';
import routeConstants from '../../../../../utils/constants/routes';
import BaseLayout from '../../../../../layouts/BaseLayout';
import useCoachProfileSignup from '../../../../../hooks/coachProfileSignup';

async function fetchPageData(query) {
  const { slugCoach, slugEvent } = query;

  if (!slugCoach) {
    return {
      error: 'Coach not found',
    };
  }

  if (!slugEvent) {
    return {
      error: 'Event not found',
    };
  }

  const coach = await getCoachFromSlug(slugCoach);
  const event = await getEventFromSlug(slugEvent);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  if (!event || event?.ownerId !== coach?.id) {
    return {
      error: 'Event not found',
    };
  }

  const eventCoach = await getCoach(event?.ownerId);
  if (!eventCoach) {
    return {
      error: 'Event coach not found',
    };
  }
  let community = null;
  if (event?.communityId) {
    community = await getCommunityByIdFromDatabase(event?.communityId);
    if (!community) {
      return {
        error: 'Community not found',
      };
    }
  }

  const eventCoaches = await getAllEventCoaches(event?.id);

  const isCoachPartOfEvent = eventCoaches.some(
    (c) => c.coachId === coach.id && c.status === 'approved'
  );
  if (!isCoachPartOfEvent) {
    return {
      error: 'Coach is not part of the event',
    };
  }

  return {
    coach,
    community,
    event,
    eventCoach,
  };
}

function EventPage(serverProps) {
  const { t } = useTranslations();
  const { coach, community, event, eventCoach } = serverProps;

  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'event',
  });

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      allowSignup
      onAuthChange={onAuthChange}>
      <Head>
        <title>
          {t('event_meta_title', {
            eventName: event.title,
          })}
        </title>
        <meta
          name="description"
          content={t('event_meta_description', {
            eventName: event.title,
          })}
        />
        <meta itemProp="image" property="og:image" content={event.image} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/events/${event.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/events/${event.slug}`}
        />
      </Head>
      <div className="page">
        <Event
          coach={coach}
          community={community}
          event={event}
          eventCoach={eventCoach}
          onSubmitSignup={onSubmitSignup}
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
        route: '/coaches/[slugCoach]/events/[slugEvent]',
      })),
    };
    return { props };
  }
);

export default EventPage;
