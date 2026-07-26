import React, { useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import useAllCoaches from '@/hooks/allCoaches';
import LayoutWithNav from '../../../layouts/LayoutWithNav';
import { wrapper } from '../../../store';
import { getCoachFromSlug } from '../../../models/coach';
import Loader from '../../../components/app/Loader';
import routeConstants from '../../../utils/constants/routes';
import SlugCoachNew from '../../../components/page/coaches/[slugCoachNew]';
import { getAllCountriesAction } from '../../../store/slices/countries';
import BaseLayout from '../../../layouts/BaseLayout';
import useCoachProfileSignup from '../../../hooks/coachProfileSignup';
import useAuthUser from '../../../hooks/authUser';
import { getUserFromWaitList } from '../../../models/service';
import { setWaitListStatus } from '../../../store/slices/coaching';

function formatCoachData(coach) {
  if (!coach) return null;

  const {
    id,
    name,
    slug,
    bio,
    bioShort,
    countryCode,
    followersCount,
    listenedCount,
    playedCount,
    professionalTitle,
    coachingEnabledAt,
    bookable,
    maxCoachingClients,
    coachingClientsCount,
    approvedTrackCount,
    types,
    profilePicture,
    profilePictureThumbs,
    profileBgRemovedPicture,
    specialties,
  } = coach || {};

  const formattedCoach = {
    id: id ?? null,
    name: name ?? null,
    slug: slug ?? null,
    bio: bio ?? null,
    bioShort: bioShort ?? null,
    countryCode: countryCode ?? null,
    followersCount: followersCount ?? null,
    listenedCount: listenedCount ?? null,
    playedCount: playedCount ?? null,
    professionalTitle: professionalTitle ?? null,
    coachingEnabledAt: coachingEnabledAt ?? null,
    bookable: bookable ?? null,
    maxCoachingClients: maxCoachingClients ?? null,
    coachingClientsCount: coachingClientsCount ?? null,
    approvedTrackCount: approvedTrackCount ?? null,
    types: types ?? null,
    profilePicture: profilePicture ?? null,
    profileBgRemovedPicture: profileBgRemovedPicture ?? null,
    specialties: specialties ?? null,
    profilePictureThumbs: profilePictureThumbs ?? {},
  };

  return formattedCoach;
}

async function fetchPageData(query) {
  if (!query.slugCoach) {
    return {
      error: 'CoachId not found',
    };
  }
  const coach = await getCoachFromSlug(query.slugCoach);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }

  // Format coach data to only include specified fields
  const formattedCoach = formatCoachData(coach);

  return {
    coach: formattedCoach,
  };
}

function CoachDetails(serverProps) {
  const { coach } = serverProps;
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  useAllCoaches();

  useEffect(() => {
    async function checkUserInWaitList() {
      const res = await getUserFromWaitList(coach.id, user.id);
      if (res && !res.error) {
        dispatch(setWaitListStatus(true));
      }
    }
    if (coach && user) {
      checkUserInWaitList();
    }
  }, [user, coach, dispatch]);

  const {
    name,
    profilePicture,
    professionalTitle = 'Mindfulness Expert',
    bio = '',
    bioShort,
    slug,
  } = coach || {};

  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'coach-public-profile',
  });
  const seoCoachDesc = useCallback(() => {
    let desc = `${bioShort || bio.replace(/\n/g, ' ')}`;
    if (desc.length < 85) {
      desc = `${desc} Listen to all of ${name}'s tracks on Aura - the #1 Mindfulness App`;
    } else if (desc.length >= 85 && desc.length <= 99) {
      desc = `${desc} Listen to all of ${name}'s tracks on Aura`;
    }
    return desc;
  }, [bio, bioShort, name]);

  const seoCoachesTitle = useCallback(() => {
    let pageTitle = `${name} - ${professionalTitle} on Aura`;
    if (pageTitle.length > 70) {
      pageTitle = `${name} - Aura Coach`;
    }
    if (pageTitle.length > 70) {
      pageTitle = `${name}`;
    }
    return pageTitle;
  }, [name, professionalTitle]);

  if (!coach) {
    return (
      <LayoutWithNav>
        <Loader />
      </LayoutWithNav>
    );
  }

  return (
    <BaseLayout
      hideFooterBackground
      hideBackgroundImages
      useAuth
      onAuthChange={onAuthChange}
      allowSignup>
      <Head>
        <title>{seoCoachesTitle()}</title>
        <meta name="description" content={seoCoachDesc()} />
        <meta property="og:title" content={seoCoachesTitle()} />
        <meta property="og:description" content={seoCoachDesc()} />
        <meta itemProp="image" property="og:image" content={profilePicture} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${slug}`}
        />
      </Head>
      <SlugCoachNew coach={coach} onSubmitSignup={onSubmitSignup} />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, res, locale }) => {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=600, stale-while-revalidate=600'
      );
      let props = await fetchPageData(params);
      await store.dispatch(getAllCountriesAction());

      if (props.error) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/coaches/[slugCoach]',
        })),
      };
      return { props };
    }
);

export default CoachDetails;
