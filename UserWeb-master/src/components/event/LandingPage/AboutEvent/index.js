import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function AboutEvent({ eventDescription }) {
  const { t } = useTranslations();
  return (
    <div>
      <div className={styles.aboutEventLabel}>{t('event_description')}</div>
      <div className={styles.aboutEventDescription}>{eventDescription}</div>
    </div>
  );
}

export default AboutEvent;
