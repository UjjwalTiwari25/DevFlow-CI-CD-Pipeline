import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function AlreadySubscribedCard({ excludeDiscovery }) {
  const { t } = useTranslations();
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        {t(
          !excludeDiscovery
            ? 'video_coaching_you_already_have_appointment'
            : 'video_coaching_you_already_subscribed'
        )}
      </div>
    </div>
  );
}

export default AlreadySubscribedCard;
