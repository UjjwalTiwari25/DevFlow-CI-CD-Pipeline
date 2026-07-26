import React from 'react';
import Image from 'next/image';
import AuraButton from '@/components/app/AuraButton';
import useTranslations from '@/hooks/translations';
import styles from './styles.module.scss';

function JoinWaitListCard({ onJoinWaitlist }) {
  const { t } = useTranslations();
  return (
    <div className={styles.joinWaitListWrapper}>
      <Image
        src="/static/images/videoCoaching/avatarList.png"
        height={50}
        width={100}
        alt="Avatar"
      />
      <div className={styles.joinWaitListTitle}>
        {t('video_coaching_join_waitlist_title')}
      </div>
      <div className={styles.spotOpenText}>
        {t('video_coaching_join_waitlist_sub_title')}
      </div>

      <AuraButton
        horizontalGradient
        title={t('button_join_waitlist')}
        onClick={onJoinWaitlist}
        style={{
          borderRadius: '9999px',
          background: 'linear-gradient(46deg, #4CCAFF 0%, #1DF5ED 102.13%)',
          boxShadow: '0px 24px 40px 6px rgba(56, 218, 247, 0.30)',
          width: '100%',
        }}
      />
    </div>
  );
}

export default JoinWaitListCard;
