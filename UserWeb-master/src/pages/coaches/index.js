import React from 'react';
import Head from 'next/head';
import I18N from '@/services/I18N';
import { getISOLocale } from '@/models/locale';
import appConstants from '@/utils/constants/app';
import { setAppLocale } from '@/store/slices/app';
import LayoutWithNav from '../../layouts/LayoutWithNav';
import CoachesPage from '../../components/page/coaches';
import { wrapper } from '../../store';
import { listCoaches } from '../../models/coach';
import routeConstants from '../../utils/constants/routes';
import { getAllCountriesAction } from '../../store/slices/countries';

function formatCoachListItem(coach) {
  if (!coach) return null;

  const {
    name,
    countryCode,
    professionalTitle,
    slug,
    profilePictureThumbs,
    profilePicture,
  } = coach;

  return {
    name: name ?? null,
    countryCode: countryCode ?? null,
    professionalTitle: professionalTitle ?? null,
    slug: slug ?? null,
    profilePictureThumbs: profilePictureThumbs ?? {},
    profilePicture: profilePicture ?? null,
  };
}

function formatCoachesList(coaches) {
  if (!coaches || !Array.isArray(coaches)) return [];
  return coaches.map((coach) => formatCoachListItem(coach));
}

function Coaches(serverProps) {
  const { coaches } = serverProps;
  return (
    <LayoutWithNav showSEOFooter>
      <Head>
        <title>Coaches and Therapists - Aura</title>
        <meta
          name="description"
          content="Explore the world's top coaches and therapists on Aura and listen to coach guided meditations, stories, life coaching tracks and much more."
        />
        <meta property="og:title" content="Coaches and Therapists - Aura" />
        <meta
          property="og:description"
          content="Explore the world's top coaches and therapists on Aura and listen to coach guided meditations, stories, life coaching tracks and much more."
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}`}
        />
      </Head>
      <CoachesPage coaches={coaches} />
    </LayoutWithNav>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ res, locale }) => {
      res.setHeader(
        'Cache-Control',
        'public, s-maxage=600, stale-while-revalidate=600'
      );
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      // Get total count first (without pagination)
      const allCoaches = await listCoaches({
        bypassCDN: locale === appConstants.DEFAULT_LOCALE,
        locale: getISOLocale(locale),
      });
      // Format coaches list to only include specified fields
      const formattedCoaches = formatCoachesList(allCoaches);
      let props = { coaches: formattedCoaches };
      await store.dispatch(getAllCountriesAction());
      props = {
        ...props,
        ...(await I18N.loadLocale({ locale, route: '/coaches' })),
      };
      return { props };
    }
);

export default Coaches;
