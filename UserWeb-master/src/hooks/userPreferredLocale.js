import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAllLocales, getISOLocale, getLocaleConfig } from '@/models/locale';
import { getCookie } from '@/utils';
import Logger from '@/services/Logger';
import useAuthUser from './authUser';

function useUserPreferredLocale() {
  const router = useRouter();
  const { user, isLoading, authLoading } = useAuthUser();
  const { locale: userLocale } = user || {};
  const localeList = Object.keys(getAllLocales());

  const { pathname, query, asPath, locale } = router;
  const currentLocale = getISOLocale(locale);

  useEffect(() => {
    if (isLoading || authLoading) return;
    let preferredLocale = userLocale;
    // Locale preference order - user profile, cookies or local storage, browser settings
    if (!userLocale) {
      const cookieLocale = getCookie('PREFERRED_LOCALE');
      Logger.debug('No user locale found, getting cookie locale', {
        cookieLocale,
      });
      if (cookieLocale) {
        preferredLocale = getISOLocale(cookieLocale);
      } else if (typeof window !== 'undefined' && window.navigator?.languages) {
        // Logger.debug('No cookie locale found, getting browser locale', {
        //   cookieLocale,
        // });
        // preferredLocale = getUserPreferredLocale();
      }
    }
    if (!preferredLocale || currentLocale === preferredLocale) return;
    if (
      !localeList ||
      localeList.length === 0 ||
      !localeList.includes(preferredLocale)
    ) {
      return;
    }
    const { urlPathId } = getLocaleConfig(preferredLocale);
    if (urlPathId) {
      preferredLocale = urlPathId;
    }
    router.replace({ pathname, query }, asPath, { locale: preferredLocale });
  }, [
    asPath,
    authLoading,
    isLoading,
    localeList,
    currentLocale,
    pathname,
    query,
    router,
    user,
    userLocale,
  ]);
}

export default useUserPreferredLocale;
