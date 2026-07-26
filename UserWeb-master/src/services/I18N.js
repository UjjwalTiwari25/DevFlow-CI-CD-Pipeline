import { getISOLocale } from '@/models/locale';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';

const routeNamespaceMap = {
  '/coaching-plan/[slugCoach]': ['yourplan'],
  '/coaches/[slugCoach]/courses/[slugCourse]': ['course'],
  '/coaches/[slugCoach]/video-coaching': ['videoCoaching'],
  '/coaches/[slugCoach]/communities/[slugCommunity]': ['community'],
  '/coaches/[slugCoach]/events/[slugEvent]': ['event'],
  '/signup': ['signup'],
  '/your-plan': ['yourplan', 'signup'],
  '/subscribe/[pricing]': ['subscribe', 'getapp'],
  '/subscribe/iap/[userId]/[pricing]': ['subscribe'],
  '/subscribe/webview/[userId]/paywall': ['subscribe'],
  '/subscribe/iap/success': ['getapp'],
  '/subscribe/upsell': ['upsell'],
  '/getapp': ['getapp'],
  '/guestpass/[slugCoach]': ['guestpass'],
  '/refer/[referralCode]/tracks/[trackId]': ['trackReferral'],
  '/refer/[referralCode]/live/[liveEventId]': ['liveReferral'],
  '/refer/[referralCode]/guest-pass': ['guestPassReferral'],
  '/refer/[referralCode]/challenges/[challengeId]': ['challengeReferral'],
  '/refer/[referralCode]/playlist/[...slug]': ['playlistReferral'],
  '/refer/[referralCode]': ['refer'],
  '/refer/new/[referralCode]': ['refer'],
};

const getNamespacesForRoute = (route) => {
  const ns = routeNamespaceMap[route] || [];
  if (route === '/signup') {
    ns.push('yourplan');
  }
  ns.push('common');
  return ns;
};

const loadLocale = async ({ locale, route }) => {
  const translations = await serverSideTranslations(
    getISOLocale(locale),
    getNamespacesForRoute(route)
  );
  return translations;
};

const I18N = {
  getNamespacesForRoute,
  loadLocale,
};

export default I18N;
