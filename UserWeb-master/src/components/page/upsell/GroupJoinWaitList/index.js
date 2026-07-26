import React from 'react';
import useTheme, { THEMES } from '@/hooks/theme';
import styles from './styles';
import useBrowserHistory from '../../../../hooks/browserHistory';
import JoinWaitListExtended from '../JoinWaitListExtended';
import useAuthUser from '../../../../hooks/authUser';
import { setuserCoachingWaitlist } from '../../../../models/service';
import Analytics from '../../../../services/Analytics';

const valueProps = [
  {
    icon: '/static/images/joinlist/icons/chat.png',
    text: 'Unlimited access to personalized 1-on-1 coaching',
  },
  {
    icon: '/static/images/joinlist/icons/notes.png',
    text: 'Custom recommendations from your coach',
  },
  {
    icon: '/static/images/joinlist/icons/circle.png',
    text: 'Beautiful mindfulness, sleep, and mood tracking with automated insights',
  },
  {
    icon: '/static/images/joinlist/icons/journal.png',
    text: 'Shared & private journal',
  },
  {
    icon: '/static/images/joinlist/icons/video.png',
    text: 'Live video onboarding call',
  },
];
export default function GroupJoinWaitList({ onNext, onBack, experiments }) {
  useBrowserHistory('groupJoinWaitList', true, onBack, onNext);
  const { user } = useAuthUser();
  useTheme(THEMES.DARK);

  async function handleJoinList() {
    if (user) {
      await setuserCoachingWaitlist(user.id);
      Analytics.track('Joined Coaching Wait List', {
        UserId: user && user.id,
      });
      handleNext();
    }
  }
  function handleNotNow() {
    Analytics.track('Skip Coaching Wait List', {
      UserId: user && user.id,
    });
    handleNext();
  }

  function handleNext() {
    if (!user) return;
    onNext();
  }

  return (
    <div className="col align-center main-wrapper">
      <img
        src="/static/images/joinlist/background.png"
        alt="aura-background"
        className="aura-background"
      />
      <div className="col align-center main">
        <JoinWaitListExtended
          valueProps={valueProps}
          handleJoinList={handleJoinList}
          handleNotNow={handleNotNow}
          experiments={experiments}
        />
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}
