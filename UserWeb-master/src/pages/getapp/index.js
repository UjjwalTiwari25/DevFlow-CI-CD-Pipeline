import React from 'react';
import Head from 'next/head';
import useTheme, { THEMES } from '@/hooks/theme';
import I18N from '@/services/I18N';
import { wrapper } from '@/store';
import useTranslations from '@/hooks/translations';
import { getCoachDetails, setCoachDetailsAction } from '@/store/slices/coaches';
import { getLiveEvent } from '@/models/live';
import { setLiveEventAction } from '@/store/slices/live';
import BaseLayout from '../../layouts/BaseLayout';
import routeConstants from '../../utils/constants/routes';
import GetAppPage from '../../components/page/getapp';

export default function GetApp() {
  useTheme(THEMES.LIGHT);
  const { t } = useTranslations();

  return (
    <BaseLayout>
      <Head>
        <title>{t('meta_getapp_title')}</title>
        <meta property="og:title" content={t('meta_getapp_title')} />
        <meta name="description" content={t('meta_getapp_description')} />
        <meta
          property="og:description"
          content={t('meta_getapp_description')}
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_GET_APP}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <GetAppPage />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      const storeData = store.getState();
      const storeLiveEventDetails = storeData?.live?.liveEventDetails;
      const { liveEventId } = query;
      let coachId = null;

      if (liveEventId && storeLiveEventDetails?.id === liveEventId) {
        coachId = storeLiveEventDetails?.coachId;
      } else if (liveEventId) {
        const liveEventResponse = await getLiveEvent(liveEventId);
        if (liveEventResponse) {
          store.dispatch(setLiveEventAction(liveEventResponse));
          coachId = liveEventResponse?.coachId;
        }
      }
      if (coachId) {
        const coachDetailsResponse = await store
          .dispatch(getCoachDetails(coachId))
          .unwrap();
        store.dispatch(setCoachDetailsAction(coachDetailsResponse));
      }
      return {
        props: {
          ...(await I18N.loadLocale({
            locale,
            route: '/getapp',
          })),
        },
      };
    }
);
