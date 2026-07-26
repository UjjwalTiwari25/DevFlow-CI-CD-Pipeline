import React from 'react';
import useTranslations from '@/hooks/translations';
import Image from 'next/image';
import styles from './styles.module.scss';

function AuraSatisfaction() {
  const { t } = useTranslations();
  return (
    <div className={styles.auraSatisfaction}>
      <Image
        alt="secure-icon"
        src="/static/icons/gradient-secure.svg"
        height={24}
        width={24}
      />
      <div className={styles.auraSatisfactionLabel}>
        {t('course_aura_satisfaction_guarantee_title')}
      </div>
      <div className={styles.auraSatisfactionText}>
        {t('course_aura_satisfaction_guarantee_description')}
      </div>
    </div>
  );
}

export default AuraSatisfaction;
