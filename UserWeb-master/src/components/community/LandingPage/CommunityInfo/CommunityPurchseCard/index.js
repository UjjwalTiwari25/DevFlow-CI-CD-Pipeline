import VideoPlayer from '@/components/app/VideoPlayer';
import useTranslations from '@/hooks/translations';
import I18NFormatter from '@/services/I18NFormatter';
import { convertToDollar } from '@/utils';
import CoachInfo from './CoachInfo';
import JoinCommunityButton from '../../JoinCommunityButton';
import styles from './styles.module.scss';

function CommunityPurchaseCard({
  community,
  coach,
  onJoinCommunity,
  onVideoPlayClick,
}) {
  const { t } = useTranslations();
  const { video, image, offerings, videoThumbnail } = community || {};
  const totalEstimatedValue = offerings
    ? offerings.reduce((acc, offer) => acc + Number(offer.estimatedValue), 0)
    : 0;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.communityVideo}>
        <VideoPlayer
          videoSrc={video}
          style={{ borderRadius: 16 }}
          enableModal={true}
          fallBackThumbnail={videoThumbnail || image}
          hideDuration
          showOverlay
          onPlayClick={onVideoPlayClick}
        />
      </div>
      <CoachInfo coach={coach} />

      <div className={styles.communityJoinInfoTable}>
        <div className={styles.joinCommunityText}>
          {t('community_join_text', { name: community.name })}
        </div>

        {offerings &&
          offerings?.map((offer, index) => {
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
        {offerings && offerings?.length > 0 && (
          <hr className={styles.offeringsTableDivider} />
        )}
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
          <div className={styles.totalValueText}>
            {t('community_table_your_cost')}
          </div>
          <div className={styles.yourCostPerMonth}>
            {t('community_table_your_cost_per_month', {
              communityPrice: I18NFormatter.formatCurrency(
                convertToDollar(community?.price),
                {
                  maximumFractionDigits: 0,
                }
              ),
            })}
          </div>
        </div>
      </div>
      <JoinCommunityButton onClick={onJoinCommunity} />
    </div>
  );
}
export default CommunityPurchaseCard;
