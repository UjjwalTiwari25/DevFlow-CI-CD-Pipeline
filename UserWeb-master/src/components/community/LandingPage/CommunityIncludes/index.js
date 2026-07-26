import React from 'react';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import CommunityCourse from './CommunityCourse';
import CommunityLiveEvent from './CommunityLiveEvent/Index';
import Community from './Community';
import ExclusiveContent from './ExclusiveContent';
import styles from './styles.module.scss';
import JoinCommunityButton from '../JoinCommunityButton';

function CommunityIncludes({
  community,
  coach,
  onJoinCommunity,
  communityCourses,
  communityEvents,
  isUserSubscriber,
}) {
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();

  return (
    <div className={styles.includesSection}>
      <div className={styles.includesText}>{t('community_includes_label')}</div>
      <div className={styles.cardContainer}>
        {communityCourses && communityCourses?.length > 0 && (
          <CommunityCourse
            community={community}
            communityCourses={communityCourses}
            coach={coach}
          />
        )}
        {communityEvents && communityEvents?.length > 0 && (
          <CommunityLiveEvent coach={coach} communityEvents={communityEvents} />
        )}
        <Community community={community} coach={coach} />
        <ExclusiveContent
          coach={coach}
          communityEvents={communityEvents}
          communityCourses={communityCourses}
        />
      </div>

      {!isMobile && !isUserSubscriber && (
        <JoinCommunityButton onClick={onJoinCommunity} />
      )}
    </div>
  );
}

export default CommunityIncludes;
