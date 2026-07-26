import React from 'react';
import { convertToDollar } from '@/utils';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import Image from 'next/image';
import styles from './styles.module.scss';
import JoinCommunityButton from '../JoinCommunityButton';

function CommunityTable({
  offerings,
  onJoinCommunity,
  price,
  isUserSubscriber,
  community,
}) {
  const [, isMobile] = useResponsiveWindow();
  const { t } = useTranslations();

  const totalEstimatedValue =
    offerings &&
    offerings.reduce((acc, offer) => acc + Number(offer.estimatedValue), 0);
  return (
    <div className={styles.communityTableCard}>
      <div className={styles.communityTableCardHeader}>
        {isMobile && (
          <div className={styles.gradientGiftIconWrapper}>
            <Image
              alt="gift-icon"
              src="/static/icons/gradient-gift.svg"
              height={28}
              width={28}
            />
          </div>
        )}
        <div className={styles.communityTableCardHeaderText}>
          <div className={styles.allOfThisText}>
            {t('community_gain_access', {
              communityPrice: I18NFormatter.formatCurrency(
                convertToDollar(price),
                { maximumFractionDigits: 0 }
              ),
              name: community.name,
            })}
          </div>
          {isMobile && (
            <div className={styles.realValueText}>
              {t('community_table_real_value', {
                communityValue: I18NFormatter.formatCurrency(
                  convertToDollar(totalEstimatedValue),
                  { maximumFractionDigits: 0 }
                ),
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles.communityOfferingsTable}>
        {!isMobile && offerings?.length > 0 && (
          <div className={styles.communityOfferingsSection}>
            <div className={styles.offeringsHeadingOne}>
              {t('community_table_included_membership')}
            </div>
            <div className={styles.offeringsHeadingTwo}>
              {t('community_table_value')}
            </div>
          </div>
        )}
        {offerings?.map((offer, index) => {
          return (
            <div key={index} className={styles.communityOfferingsSection}>
              <div className={styles.offerTitle}>{offer.title}</div>
              <div className={styles.offerValue}>
                {I18NFormatter.formatCurrency(
                  convertToDollar(offer.estimatedValue),
                  { maximumFractionDigits: 0 }
                )}
              </div>
            </div>
          );
        })}
        <hr className={styles.offeringsTableDivider} />
        <div className={styles.communityOfferingsSection}>
          <div className={styles.totalValueText}>
            {t('community_table_total_value')}
          </div>
          <div className={styles.totalValueStrike}>
            {I18NFormatter.formatCurrency(
              convertToDollar(totalEstimatedValue),
              {
                maximumFractionDigits: 0,
              }
            )}
          </div>
        </div>
        <div className={styles.communityOfferingsSection}>
          <div className={styles.yourCostText}>
            {t('community_table_your_cost')}
          </div>
          <div className={styles.yourCostPerMonth}>
            {t('community_table_your_cost_per_month', {
              communityPrice: I18NFormatter.formatCurrency(
                convertToDollar(price),
                {
                  maximumFractionDigits: 0,
                }
              ),
            })}
          </div>
        </div>
      </div>

      {!isUserSubscriber && !isMobile && (
        <JoinCommunityButton onClick={onJoinCommunity} />
      )}
    </div>
  );
}

export default CommunityTable;
