import React from 'react';
import Head from 'next/head';
import useTheme, { THEMES } from '@/hooks/theme';
import useCelebrity from '@/hooks/celebrity';
import I18N from '@/services/I18N';
import useTranslations from '@/hooks/translations';
import BaseLayout from '../../layouts/BaseLayout';
import routeConstants from '../../utils/constants/routes';
import YourPlanClean from '../../components/yourPlan/clean';
import usePageQuery from '../../hooks/pageQuery';
import useAuthUser from '../../hooks/authUser';
import useThemeListener from '../../hooks/themeListener';
import useExperiments from '../../hooks/experiments';
import Loader from '../../components/app/Loader';

const EXPERIMENTS = [];

function renderYourPlanBody({ experiments, user, celebrity }) {
  if (!experiments) {
    return <Loader />;
  }
  return (
    <YourPlanClean
      experiments={experiments}
      user={user}
      isCelebrityOnboarding={!!celebrity}
      celebrity={celebrity}
    />
  );
}

function YourPlan() {
  const pageQuery = usePageQuery({
    fetchUserFromQuery: true,
  });
  const { userId = null, noTrial3SKUs, threeSKUV2 } = pageQuery;
  const { t } = useTranslations();
  const { user } = useAuthUser();
  const celebrity = useCelebrity();

  if (
    noTrial3SKUs &&
    (noTrial3SKUs === true || noTrial3SKUs.toLowerCase() === 'true')
  ) {
    EXPERIMENTS.push('noTrial3SKUs');
  }

  if (
    threeSKUV2 &&
    (threeSKUV2 === true || threeSKUV2.toLowerCase() === 'true') &&
    !EXPERIMENTS.includes('threeSKUsV2')
  ) {
    EXPERIMENTS.push('threeSKUsV2');
  }

  const [experiments] = useExperiments(EXPERIMENTS, user);

  useTheme(THEMES.DARK);
  const { isDark } = useThemeListener();

  return (
    <BaseLayout useAuth isUserFromQuery={!!userId} isDarkMode={isDark}>
      <Head>
        <title>{t('meta_yourplan_title')}</title>
        <meta property="og:title" content={t('meta_yourplan_title')} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content={t('meta_yourplan_description')} />
        <meta
          property="og:description"
          content={t('meta_yourplan_description')}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_YOUR_PLAN}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      {renderYourPlanBody({
        experiments,
        user,
        celebrity,
      })}
    </BaseLayout>
  );
}

export const getStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await I18N.loadLocale({ locale, route: '/your-plan' })),
    },
  };
};

export default YourPlan;
