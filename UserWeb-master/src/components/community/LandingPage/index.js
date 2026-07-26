import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import NewFooter from '@/components/app/NewFooter';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Analytics from '@/services/Analytics';
import { getCoach } from '@/models/coach';
import CommunityHeader from './CommunityHeader';
import CommunityIncludes from './CommunityIncludes';
import YourTeam from './YourTeam';
import CommunityBenefits from './CommunityBenefits';
import CommunityTable from './CommunityTable';
import MoneyBackGuarantee from './MoneyBackGuarantee';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import CommunityInfo from './CommunityInfo';

import styles from './styles.module.scss';
import JoinCommunityButton from './JoinCommunityButton';

function CommunityLandingPage({
  community,
  coach,
  onJoinCommunity,
  isLoginModalVisible,
  isPaymentModalVisible,
  isUserSubscriber,
  communityCourses,
  communityEvents,
}) {
  const [communityCoaches, setCommunityCoaches] = useState([]);

  const router = useRouter();
  const [showButton, setShowButton] = useState(false);
  const [, isMobile] = useResponsiveWindow();
  const { benefits, offerings, price, moneyBackGuarantee } = community;

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      const coaches = await Promise.all(
        community?.coaches.map(async (coachItem) => {
          const coachDetails = await getCoach(coachItem.coachId);
          return coachDetails;
        })
      );
      setCommunityCoaches(coaches);
    };

    fetchCoaches();
  }, [community?.coaches]);

  const commonAnalyticsParams = useMemo(() => {
    return {
      Screen: 'Community Landing Page',
      'Sent From': 'Community Landing Page',
      'Page Name': 'Community',
      'Page Path': router.asPath,
      'Page Type': 'Community',
      'Community Name': community.name,
      'Community ID': community.id,
      'Community Coach Names': communityCoaches.map(
        (coachItem) => coachItem.name
      ),
      'Community Coach IDs': communityCoaches.map((coachItem) => coachItem.id),
      'Community Owner ID': community.ownerId,
      'Community Membership Status': isUserSubscriber
        ? 'Subscriber'
        : 'Not Subscribed',
      'Community Revenue': community.price,
    };
  }, [community, router, isUserSubscriber, communityCoaches]);

  const handleJoinCommunityButtonClick = () => {
    Analytics.track('Button Tapped', {
      Button: 'Join Community',
      ...(commonAnalyticsParams || {}),
    });
    onJoinCommunity();
  };

  const onVideoPlayClick = (videoURL) => {
    Analytics.track('Video Tapped', {
      'Video URL': videoURL,
      ...(commonAnalyticsParams || {}),
    });
  };

  return (
    <div className={styles.communityLandingPage}>
      <CommunityHeader
        community={community}
        onJoinCommunity={handleJoinCommunityButtonClick}
        isUserSubscriber={isUserSubscriber}
      />
      <div className={styles.communityLandingPageContent}>
        <CommunityInfo
          community={community}
          coach={coach}
          onJoinCommunity={handleJoinCommunityButtonClick}
          isUserSubscriber={isUserSubscriber}
          onVideoPlayClick={onVideoPlayClick}
        />

        <CommunityBenefits
          benefits={benefits}
          onJoinCommunity={handleJoinCommunityButtonClick}
          isUserSubscriber={isUserSubscriber}
        />
        <CommunityIncludes
          community={community}
          coach={coach}
          onJoinCommunity={handleJoinCommunityButtonClick}
          communityCourses={communityCourses}
          communityEvents={communityEvents}
          isUserSubscriber={isUserSubscriber}
        />
        <YourTeam community={community} communityCoaches={communityCoaches} />
        {moneyBackGuarantee && (
          <MoneyBackGuarantee moneyBackGuaranteeData={moneyBackGuarantee} />
        )}
        <CommunityTable
          offerings={offerings}
          onJoinCommunity={handleJoinCommunityButtonClick}
          price={price}
          isUserSubscriber={isUserSubscriber}
          community={community}
        />

        <div className={styles.footerWrapper}>
          <NewFooter cleanDesign />
        </div>
        {isMobile &&
          showButton &&
          !isLoginModalVisible &&
          !isPaymentModalVisible &&
          !isUserSubscriber && (
            <div
              className={classNames(
                'row align-center',
                styles.buttonContainer,
                styles.mobileOnly
              )}>
              <JoinCommunityButton
                onClick={handleJoinCommunityButtonClick}
                style={{
                  width: '100%',
                  maxWidth: 428,
                }}
              />
            </div>
          )}
      </div>
    </div>
  );
}

export default CommunityLandingPage;
