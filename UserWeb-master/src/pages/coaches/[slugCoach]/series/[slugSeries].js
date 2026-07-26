import React, { useEffect, useState } from 'react';
import I18N from '@/services/I18N';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { listMeditations } from '../../../../models/meditation';
import Loader from '../../../../components/app/Loader';
import LayoutWithNav from '../../../../layouts/LayoutWithNav';
import SlugSeries from '../../../../components/page/coaches/[slugSeries]';
import useAuthUser from '../../../../hooks/authUser';
import { getCoachFromSlug } from '../../../../models/coach';
import useCountryDetails from '../../../../hooks/countryDetails';
import {
  fetchSeries,
  getListenedSeriesTracks,
} from '../../../../models/series';
import { wrapper } from '../../../../store';

async function fetchPageData(params) {
  const { slugCoach, slugSeries } = params;
  let coach = null;
  let series = null;
  let tracks = null;
  if (!slugCoach) {
    return { error: 'Coach Slug not found!' };
  }
  if (slugCoach) {
    const res = await getCoachFromSlug(slugCoach);
    if (res && !res.error) {
      coach = res;
    }
  }
  if (!slugSeries) {
    return { error: 'Series Slug not found!' };
  }
  if (slugSeries) {
    const res = await fetchSeries({ id: slugSeries });
    if (!res || res.error || res?.coachId !== coach?.id) {
      return { error: 'Series not found!' };
    }
    if (res && !res.error) {
      series = res;
      if (res.data && res.data.contents) {
        const ids = [];
        res.data.contents.forEach((meditation) => {
          if (meditation && meditation.trackId) {
            ids.push(meditation.trackId);
          }
        });
        const response = await listMeditations(ids);
        if (!response || res.error) {
          return { error: 'Series Tracks not found!' };
        }
        if (!response.error) {
          tracks = response;
        }
      }
    }
  }
  return {
    coach,
    series,
    tracks,
    slugSeries,
  };
}
function SlugChannel(serverProps) {
  const { coach, series, tracks } = serverProps;

  const { user } = useAuthUser();
  const [userSeries, setUserSeries] = useState(null);

  const { countryDetails } = useCountryDetails(coach && coach.countryCode);
  useEffect(() => {
    async function fetchSeriesDetails() {
      const res = await getListenedSeriesTracks(user.id);
      setUserSeries(res);
    }
    if (user) {
      fetchSeriesDetails();
    }
  }, [user]);

  if (!series || !coach || !tracks) {
    return (
      <LayoutWithNav>
        <Loader />
      </LayoutWithNav>
    );
  }

  return (
    <LayoutWithNav
      hideFooterBackground
      hideBackgroundImages
      showBanner={false}
      showSeriesBackground={true}>
      <SlugSeries
        series={series}
        tracks={tracks}
        coach={coach}
        countryDetails={countryDetails}
        userSeries={userSeries}
      />
    </LayoutWithNav>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      let props = await fetchPageData(params);
      if (props.error) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      props = {
        ...props,
        ...(await I18N.loadLocale({
          locale,
          route: '/coaches/[slugCoach]/series/[slugSeries]',
        })),
      };
      return { props };
    }
);

export default SlugChannel;
