import React from 'react';
import Head from 'next/head';
import { getCoachDetails } from '@/store/slices/coaches';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import { getISOLocale, getLocaleImage } from '@/models/locale';
import { setAppLocale } from '@/store/slices/app';
import useAllCoaches from '@/hooks/allCoaches';
import { wrapper } from '../../../store';
import { getCoachIdFromSlug, getCoachTracks } from '../../../models/coach';
import BaseLayout from '../../../layouts/BaseLayout';
import Analytics from '../../../services/Analytics';
import { getUser } from '../../../models/user';
import referralConstants from '../../../utils/constants/referral';
import Loader from '../../../components/app/Loader';
import GuestPassCoachSlug from '../../../components/page/guestpass/[slugCoach]';

async function fetchPageData(query, { locale, store }) {
  if (!query.slugCoach) {
    return { error: 'coach slug is not preset' };
  }
  const coachId = await getCoachIdFromSlug(query.slugCoach);
  const coach = await store.dispatch(getCoachDetails(coachId)).unwrap();
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  let tracks = [];
  if (coach) {
    tracks = await getCoachTracks({
      limit: 7,
      authorId: coach.id,
      locale,
    });
  }
  const user = await getUser(coach.id);
  if (!user) {
    return {
      error: 'User not found',
    };
  }
  return {
    coach,
    tracks,
    user,
  };
}

function CoachGuestPass(serverProps) {
  const { coach, tracks, user } = serverProps;
  const { t, currentLocale } = useTranslations();
  useAllCoaches();

  if (!coach) {
    return (
      <BaseLayout>
        <Loader />
      </BaseLayout>
    );
  }
  const { referralCode } = user;
  const { name } = coach;

  return (
    <BaseLayout
      onAnalyticsInit={() => {
        Analytics.track('Web Referral View', {
          'Referral Code': referralCode,
          'Referral Type': referralConstants.COACH_SUBSCRIPTION_30TRIAL,
          ReferrerId: coach.id,
        });
      }}>
      <Head>
        <title>
          {t('meta_guestpass_title', { count: 30, coachName: name })}
        </title>
        <meta
          name="description"
          content={t('meta_guestpass_description', {
            count: 30,
            coachName: name,
          })}
        />
        <meta
          property="og:title"
          content={t('meta_guestpass_title', { count: 30, coachName: name })}
        />
        <meta
          property="og:description"
          content={t('meta_guestpass_description', {
            counr: 30,
            coachName: name,
          })}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={getLocaleImage(
            `${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/guestPass.png`,
            currentLocale
          )}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <GuestPassCoachSlug coach={coach} tracks={tracks} user={user} />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, res, locale }) => {
      res.setHeader(
        'Cache-Control',
        `public, s-maxage=${60 * 60 * 24}, stale-while-revalidate=${
          60 * 60 * 24
        }`
      );
      await store.dispatch(setAppLocale(getISOLocale(locale)));

      let props = await fetchPageData(params, {
        locale: getISOLocale(locale),
        store,
      });
      if (props.coach) {
        props.key = props.coach.id;
      }
      const notFound = !!props.error;
      props = {
        ...props,
        ...(await I18N.loadLocale({ locale, route: '/guestpass/[slugCoach]' })),
      };
      return { props, notFound };
    }
);

export default CoachGuestPass;
