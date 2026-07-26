import React from 'react';
import Head from 'next/head';
import { getAllCourseCoaches, getCourseFromSlug } from '@/models/course';
import { getCoach, getCoachFromSlug } from '@/models/coach';
import Course from '@/components/page/coaches/[slugCourse]';
import useTranslations from '@/hooks/translations';
import { getCommunityByIdFromDatabase } from '@/models/community';
import I18N from '@/services/I18N';
import { wrapper } from '../../../../../store';
import routeConstants from '../../../../../utils/constants/routes';
import BaseLayout from '../../../../../layouts/BaseLayout';
import useCoachProfileSignup from '../../../../../hooks/coachProfileSignup';

async function fetchPageData(query) {
  const { slugCoach, slugCourse } = query;

  if (!slugCoach) {
    return {
      error: 'Coach not found',
    };
  }

  if (!slugCourse) {
    return {
      error: 'Course not found',
    };
  }

  const coach = await getCoachFromSlug(slugCoach);
  if (!coach) {
    return {
      error: 'Coach not found',
    };
  }

  const course = await getCourseFromSlug(slugCourse);
  if (!course || course?.ownerId !== coach?.id) {
    return {
      error: 'Course not found',
    };
  }

  const courseCoach = await getCoach(course?.ownerId);
  if (!courseCoach) {
    return {
      error: 'Course coach not found',
    };
  }

  let community = null;
  if (course?.communityId) {
    community = await getCommunityByIdFromDatabase(course?.communityId);
    if (!community) {
      return {
        error: 'Community not found',
      };
    }
  }

  const courseCoaches = await getAllCourseCoaches(course?.id);

  const isCoachPartOfCourse = courseCoaches.some(
    (c) => c.coachId === coach.id && c.status === 'approved'
  );
  if (!isCoachPartOfCourse) {
    return {
      error: 'Coach is not part of the course',
    };
  }

  return {
    coach,
    course,
    courseCoach,
    community,
  };
}

function CoursePage(serverProps) {
  const { t } = useTranslations();
  const { coach, community, course, courseCoach } = serverProps;

  const { onAuthChange, onSubmitSignup } = useCoachProfileSignup(coach, {
    installSource: 'course',
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
          {t('course_meta_title', {
            courseName: course.name,
          })}
        </title>
        <meta
          name="description"
          content={t('course_meta_description', {
            courseName: course.name,
          })}
        />
        <meta itemProp="image" property="og:image" content={course.image} />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/courses/${course.slug}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_COACHES}/${coach.slug}/courses/${course.slug}`}
        />
      </Head>
      <div className="page">
        <Course
          coach={coach}
          community={community}
          course={course}
          courseCoach={courseCoach}
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
        route: '/coaches/[slugCoach]/courses/[slugCourse]',
      })),
    };
    return { props };
  }
);

export default CoursePage;
