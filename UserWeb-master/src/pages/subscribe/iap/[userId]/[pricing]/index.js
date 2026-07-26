import React from 'react';
import Head from 'next/head';
import Iap from '@/components/page/subscribe/Iap/[userId]/[pricing]';
import { isProdMode, isTestMode } from '@/utils';
import { wrapper } from '@/store';
import { setAppLocale } from '@/store/slices/app';
import { getISOLocale } from '@/models/locale';
import { handleGetPricing, setIsIapFlow } from '@/store/slices/payment';
import Logger from '@/services/Logger';
import I18N from '@/services/I18N';
import usePageQuery from '@/hooks/pageQuery';
import useShallowEqualSelector from '@/hooks/shallowEqualSelector';
import useTrackPageView from '@/hooks/trackPageView';
import useTrackSubscriptionView from '@/hooks/trackSubscriptionView';
import { handleGetUser } from '@/store/slices/auth';
import useTranslations from '@/hooks/translations';
import BaseLayout from '@/layouts/BaseLayout';
import TiktokPixel from '@/services/TiktokPixel';
import useAuthUser from '@/hooks/authUser';

const PRICING_DATA =
  isProdMode() || isTestMode()
    ? require('../../../../../data/pricing.json')
    : require('../../../../../data/pricing-dev.json');

function Subscribe() {
  const pageQuery = usePageQuery();
  const {
    userId = null,
    utm_source,
    utm_campaign = null,
    utm_medium = null,
    utm_content = null,
  } = pageQuery;
  const { pricing } = useShallowEqualSelector(({ payment }) => payment);
  const { user } = useAuthUser();

  const eventProperties = {
    UserID: userId,
    PricingID: pricing && pricing.id,
    PricingName: pricing && pricing.name,
    attribution: utm_source,
    campaign: utm_campaign,
    medium: utm_medium,
    content: utm_content,
  };
  useTrackPageView(eventProperties, [pricing]);
  useTrackSubscriptionView(eventProperties, [pricing], {
    redirectedFromApp: true,
  });
  const { t } = useTranslations();
  return (
    <BaseLayout
      hideBackgroundImages={true}
      hideBackground={true}
      isDarkMode={false}
      hideFooterBackground={true}
      onAnalyticsInit={() => {
        TiktokPixel.trackStandard('AddToCart', { content_id: user?.id });
      }}>
      <Head>
        <title>{t('meta_subscribe_title')}</title>
        <meta name="description" content={t('meta_subscribe_description')} />
        <meta property="og:title" content={t('meta_subscribe_title')} />
        <meta
          property="og:description"
          content={t('meta_subscribe_description')}
        />
        <meta
          itemProp="image"
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_APP_DOMAIN}/static/images/banner.jpg`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1 maximum-scale=1"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <Iap pricing={pricing} user={user} />
    </BaseLayout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params, locale }) => {
      const { pricing, userId } = params;
      if (!pricing) {
        return { notFound: true };
      }
      const pricingObj = Object.values(PRICING_DATA).find(
        (item) => item.iapId === pricing || item.id === pricing
      );
      if (!pricingObj || !pricingObj.id) {
        return { notFound: true };
      }
      await store.dispatch(setAppLocale(getISOLocale(locale)));
      await store.dispatch(setIsIapFlow(true));
      const pricingDetails = await store
        .dispatch(handleGetPricing({ id: pricingObj.id }))
        .unwrap();
      const user = await store.dispatch(handleGetUser(userId)).unwrap();
      if (!pricingDetails || !user) {
        Logger.warn('No pricing or user found', {
          pricing,
          userId,
        });
        return { notFound: true };
      }
      return {
        props: {
          ...(await I18N.loadLocale({
            locale,
            route: '/subscribe/iap/[userId]/[pricing]',
          })),
        },
      };
    }
);

export default Subscribe;
