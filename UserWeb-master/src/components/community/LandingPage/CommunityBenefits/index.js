import React from 'react';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import styles from './styles.module.scss';
import JoinCommunityButton from '../JoinCommunityButton';

function CommunityBenefits({ benefits, onJoinCommunity, isUserSubscriber }) {
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();
  return (
    <div className={styles.benefitsSection}>
      <div className={styles.benefitsTextContainer}>
        <div className={styles.benefitsText}>{t('community_built_for')}</div>
        <div className={styles.benefitsWrapper}>
          <div className={styles.benefitsBackground}></div>
          <div className={styles.benefitsListWrapper}>
            {benefits?.map((benefit, index) => (
              <div key={index} className={styles.benefitCard}>
                <div className={styles.benefitCount}>{index + 1}</div>
                <div className={styles.benefitContent}>
                  <div className={styles.benefitTitle}>{benefit.title}</div>
                  <div className={styles.benefitText}>
                    {benefit.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!isMobile && !isUserSubscriber && (
        <JoinCommunityButton onClick={onJoinCommunity} />
      )}
    </div>
  );
}

export default CommunityBenefits;
