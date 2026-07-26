import React from 'react';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function Community() {
  const { t } = useTranslations();
  return (
    <div className={styles.includesCard}>
      <div className={styles.cardHeader}>
        <div className={styles.includeLabel}>{t('community_label')}</div>
        <div className={styles.includeDescription}>
          {t('community_include_description')}
        </div>
      </div>
      <div className={styles.peopleChatWrapper}>
        <img
          src="/static/images/peopleChatWithBg.png"
          alt="people-chat"
          className={styles.peopleChatWithBg}
        />
      </div>
    </div>
  );
}

export default Community;
