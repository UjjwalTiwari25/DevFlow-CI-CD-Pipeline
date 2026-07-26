import React from 'react';
import I18NFormatter from '@/services/I18NFormatter';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import VideoPlayer from '@/components/app/VideoPlayer';
import CommunityPurchaseCard from '@/components/community/LandingPage/CommunityInfo/CommunityPurchseCard';
import useTranslations from '@/hooks/translations';
import CoachInfo from './CommunityPurchseCard/CoachInfo';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './styles.module.scss';

function CommunityInfo({
  community,
  coach,
  onJoinCommunity,
  isUserSubscriber,
  onVideoPlayClick,
}) {
  const { t } = useTranslations();
  const [, , isMobileOrTablet] = useResponsiveWindow();
  const {
    mission,
    video,
    description,
    image,
    benefitsDescription,
    offeringsDescription,
    videoThumbnail,
  } = community;

  return (
    <div className={styles.communityInfoSection}>
      <div className={styles.communityInfoLeftSection}>
        <div className={styles.communityInfoWrapper}>
          {video && (
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
          )}
          <div className={styles.communityMission}>{mission}</div>
          <div className={styles.communityDescription}>{description}</div>
          {isMobileOrTablet && (
            <div className={styles.coachInfoWrapper}>
              <CoachInfo coach={coach} />
            </div>
          )}
        </div>

        {benefitsDescription && (
          <div className={styles.whyJoinSection}>
            <div className={styles.communitySectionTitle}>
              {t('community_joelle_why_join_title', { name: community?.name })}
            </div>
            <div className={styles.whyJoinListContainer}>
              {benefitsDescription.map((item, index) => (
                <div
                  key={`why-join-${index}`}
                  className={styles.listItemWrapper}>
                  <div className={styles.listItemSrNo}>
                    {I18NFormatter.formatNumber(index + 1)}
                  </div>
                  <div className={styles.listConternWrapper}>
                    <div className={styles.listItemTitle}>{item.title}</div>
                    <div className={styles.listItemDescription}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {offeringsDescription && (
          <div className={styles.whyJoinSection}>
            <div className={styles.communitySectionTitle}>
              {t('community_joelle_what_discover_title')}
            </div>
            <div className={styles.whyJoinListContainer}>
              {offeringsDescription.map((item, index) => (
                <div
                  key={`why-join-${index}`}
                  className={styles.listItemWrapper}>
                  <div className={styles.listItemSrNo}>
                    {I18NFormatter.formatNumber(index + 1)}
                  </div>
                  <div className={styles.listConternWrapper}>
                    <div className={styles.listItemTitle}>{item.title}</div>
                    {item?.description && (
                      <div className={styles.listItemDescription}>
                        {item.description}
                      </div>
                    )}
                    {item.list && (
                      <div className={styles.listItemList}>
                        {item.list.map((listItem) => (
                          <div
                            key={listItem}
                            className={styles.listItemListItem}>
                            <div className={styles.bullet}></div>
                            <div>{listItem}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {!isMobileOrTablet && !isUserSubscriber && (
        <CommunityPurchaseCard
          community={community}
          coach={coach}
          onJoinCommunity={onJoinCommunity}
          onVideoPlayClick={onVideoPlayClick}
        />
      )}
    </div>
  );
}

export default CommunityInfo;
