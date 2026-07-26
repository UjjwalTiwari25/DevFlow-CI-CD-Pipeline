import React from 'react';
import usePageQuery from '@/hooks/pageQuery';
import referralConstants from '@/utils/constants/referral';
import useTranslations from '@/hooks/translations';
import { getLocaleImage } from '@/models/locale';
import styles from './styles';

export default function MobileAppDownload({ style }) {
  const { utm_source = null } = usePageQuery();
  const { currentLocale } = useTranslations();
  return (
    <div className="mobile-container" style={style}>
      <a
        href="https://itunes.apple.com/us/app/aura-5-minute-morning-mindfulness/id1114223104"
        rel="noreferrer"
        target="_blank">
        <img
          src={getLocaleImage('/static/images/appStore.svg', currentLocale)}
          alt="download from app store"
          className="app"
        />
      </a>

      {utm_source !== referralConstants.SOURCE_CHALLENGES_REFERRAL && (
        <a
          href="https://play.google.com/store/apps/details?id=com.aurahealth&hl=en"
          rel="noreferrer"
          target="_blank">
          <img
            src={getLocaleImage('/static/images/playStore.png', currentLocale)}
            alt="download from play store"
            className="app"
          />
        </a>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
