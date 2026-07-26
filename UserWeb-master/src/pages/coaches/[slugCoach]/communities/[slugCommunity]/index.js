import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { addMinutes } from 'date-fns';
import { getCoachFromSlug } from '@/models/coach';
import {
  getAllCommunityCoaches,
  getCommunityCourses,
  getCommunityEvents,
  getCommunityFromSlug,
} from '@/models/community';
import Community from '@/components/page/coaches/[slugCommunity]';
import { wrapper } from '../../../../../store';
import routeConstants from '../../../../../utils/constants/routes';
import BaseLayout from '../../../../../layouts/BaseLayout';
import useCoachProfileSignup from '../../../../../hooks/coachProfileSignup';

async function fetchPageData(query) {
  const { slugCoach, slugCommunity } = query;

  if (!slugCoach) {
    return {
      error: 'Coach not found',
    };
  }

  if (!slugCommunity) {
    return {
      error: 'Community not found',
    };
  }

  const coach = await getCoachFromSlug(slugCoach);
  const community = await getCommunityFromSlug(slugCommunity);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  if (!community || community?.ownerId !== coach?.id) {
    return {
      error: 'Community not found',
    };
  }

  const communityCoaches = await getAllCommunityCoaches(community?.id);

  const isCoachPartOfCommunity = communityCoaches.some(
    (c) => c.coachId === coach.id
  );
  if (!isCoachPartOfCommunity) {
    return {
      error: 'Coach is not part of the community',
    };
  }

  const communityCourses = await getCommunityCourses(community?.id);
  let communityEvents = await getCommunityEvents(community?.id);

  if (communityEvents && communityEvents?.length > 0) {
    communityEvents = communityEvents
      .filter(
        (item) =>
          new Date() < addMinutes(new Date(item.scheduledAt), item.duration)
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }
  return {
    coach,
    community,
    communityCourses,
    communityEvents,
  };
}

function CommunityPage(serverProps) {
  const { coach, community, communityCourses, communityEvents } = serverProps;
  const { t } = useTranslations();
  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'community',
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
          {t('community_meta_title', {
            communityName: community.name,
          })}
        </title>
        <meta
          name="description"
          content={t('community_meta_description', {
            communityName: community.name,
          })}
        />
        <meta itemProp="image" property="og:image" content={community.image} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/communities/${community.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/communities/${community.slug}`}
        />
      </Head>
      <div className="page">
        <Community
          coach={coach}
          community={community}
          onSubmitSignup={onSubmitSignup}
          communityCourses={communityCourses}
          communityEvents={communityEvents}
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
        route: '/coaches/[slugCoach]/communities/[slugCommunity]',
      })),
    };
    return { props };
  }
);

export default CommunityPage;
