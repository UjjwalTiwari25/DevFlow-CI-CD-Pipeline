import I18N from '@/services/I18N';
import { useRouter } from 'next/router';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'next-i18next/pages';
import { getISOLocale } from '@/models/locale';

export default function useTranslations() {
  const router = useRouter();
  const ns = useMemo(
    () => I18N.getNamespacesForRoute(router.route),
    [router.route]
  );
  const { t: translate, i18n } = useTranslation(ns);
  const t = useCallback((key, options) => {
    return translate(key, options);
  }, []);
  return { t, currentLocale: i18n.language || getISOLocale(router.locale) };
}
