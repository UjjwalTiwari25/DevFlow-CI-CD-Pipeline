import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useAllCoaches from '@/hooks/allCoaches';
import VideoSession from '@/components/page/coaches/videoSession';
import Loader from '@/components/app/Loader';
import { listCoachServices } from '@/models/service';
import I18N from '@/services/I18N';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import useTranslations from '@/hooks/translations';
import { wrapper } from '../../../../store';
import {
  getCoachFromSlug,
  getCoachPackages,
  getCoachSchedulingDetails,
} from '../../../../models/coach';
import routeConstants from '../../../../utils/constants/routes';
import BaseLayout from '../../../../layouts/BaseLayout';
import useCoachProfileSignup from '../../../../hooks/coachProfileSignup';

async function fetchPageData(query) {
  if (!query.slugCoach) {
    return {
      error: 'CoachId not found',
    };
  }
  const { slugCoach } = query;
  const coach = await getCoachFromSlug(slugCoach);
  const packages = await getCoachPackages(coach?.id);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }
  if (!packages || packages.length <= 0) {
    return {
      error: 'Coach packages not found',
    };
  }
  return {
    coach,
  };
}

function VideoCoachingSession(serverProps) {
  const { t } = useTranslations();
  const { coach } = serverProps;
  const [isLoading, setIsLoading] = useState(true);
  const [coachSchedulngData, setCoachSchedulngData] = useState({
    allServices: null,
    allPackages: null,
    schedulingDetails: null,
  });

  useAllCoaches();

  useEffect(() => {
    async function getAllServices() {
      try {
        if (!coach.id) return;
        setIsLoading(true);
        const coachData = {};
        const res = await listCoachServices(coach.id);
        if (res && !res.error && res?.length > 0) {
          coachData.allServices = res;
        }
        const packages = await getCoachPackages(coach.id);
        if (packages && packages?.length > 0) {
          coachData.allPackages = packages;
        }
        const schedulingDetails = await getCoachSchedulingDetails(coach.id);
        if (schedulingDetails) {
          coachData.schedulingDetails = schedulingDetails;
        }
        setCoachSchedulngData(coachData);
        setIsLoading(false);
      } catch (error) {
        notifyHandledError(error, {
          message: 'Unable to get coach service data',
        });
        setIsLoading(false);
      }
    }
    if (coach) {
      getAllServices();
    }
  }, [coach]);

  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'one-one-coaching',
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
          {t('video_coaching_meta_title', {
            coachName: coach.name,
          })}
        </title>
        <meta
          name="description"
          content={t('video_coaching_meta_description', {
            coachName: coach.name,
          })}
        />
        <meta
          property="og:title"
          content={t('video_coaching_meta_title', {
            coachName: coach.name,
          })}
        />
        <meta
          property="og:description"
          content={t('video_coaching_meta_description', {
            coachName: coach.name,
          })}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/video-coaching`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/video-coaching`}
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="page">
        {isLoading || !coach ? (
          <Loader />
        ) : (
          <VideoSession
            coach={coach}
            onSubmitSignup={onSubmitSignup}
            coachSchedulngData={coachSchedulngData}
          />
        )}
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
        route: '/coaches/[slugCoach]/video-coaching',
      })),
    };
    return { props };
  }
);
export default VideoCoachingSession;
