import React from 'react';
import Head from 'next/head';
import useTheme, { THEMES } from '@/hooks/theme';
import I18N from '@/services/I18N';
import { wrapper } from '@/store';
import useTranslations from '@/hooks/translations';
import BaseLayout from '@/layouts/BaseLayout';
import routeConstants from '@/utils/constants/routes';
import PaymentSuccess from '@/components/page/subscribe/Iap/success';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';

export default function GetApp() {
  useTheme(THEMES.LIGHT);
  const { t } = useTranslations();

  return (
    <BaseLayout
      hideBackgroundImages={true}
      isDarkMode={false}
      hideFooterBackground={true}>
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
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/${routeConstants.PAGE_SUBSCRIBE}/${routeConstants.PAGE_IAP}/${routeConstants.PAGE_SUCCESS}`}
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <PaymentSuccess />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      return {
        props: {
          ...(await I18N.loadLocale({
            locale,
            route: '/subscribe/iap/success',
          })),
        },
      };
    }
);
