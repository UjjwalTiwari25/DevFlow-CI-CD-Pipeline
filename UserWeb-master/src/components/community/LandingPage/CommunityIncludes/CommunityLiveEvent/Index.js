import React from 'react';
import useTranslations from '@/hooks/translations';

import styles from './styles.module.scss';
import EventCard from './EventCard';

function CommunityLiveEvent({ coach, communityEvents }) {
  const { t } = useTranslations();
  const event = communityEvents[0] || {};

  return (
    <div className={styles.includesCard}>
      <div className={styles.cardHeader}>
        <div className={styles.includeLabel}>
          {t('community_includes_live_event_label')}
        </div>
        <div className={styles.includeDescription}>
          {t('community_includes_event_description')}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.macbookImageWrapper}>
          <img
            src="/static/images/macbook.png"
            alt=""
            className={styles.macbookImage}
          />
        </div>
        <EventCard coach={coach} event={event} />
      </div>
    </div>
  );
}

export default CommunityLiveEvent;
