import React from 'react';
import YourCoach from '@/components/app/YourCoach';
import YourCommunity from '@/components/app/YourCommunity';
import AboutEvent from '../AboutEvent';
import styles from './styles.module.scss';

function EventInfo({ event, isUserSubscriber, community, eventCoach }) {
  return (
    <div className={styles.eventInfoSection}>
      <AboutEvent eventDescription={event?.description} />
      <YourCoach coach={eventCoach} />
      {community && (
        <YourCommunity
          community={community}
          isUserSubscriber={isUserSubscriber}
        />
      )}
    </div>
  );
}

export default EventInfo;
