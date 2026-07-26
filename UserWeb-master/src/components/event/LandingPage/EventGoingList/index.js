import React from 'react';
import I18NFormatter from '@/services/I18NFormatter';
import useTranslations from '@/hooks/translations';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import EventAttendeeItem from '../EventAttendeeItem';
import styles from './styles.module.scss';

function EventGoingList({ eventAttendingMembers }) {
  const { t } = useTranslations();
  const [, isMobile] = useResponsiveWindow();

  const eventGoingDisplayCount = eventAttendingMembers?.slice(
    0,
    isMobile ? 4 : 5
  );

  const remainingEventAttendeesCount =
    (eventAttendingMembers?.length || 0) -
    (eventGoingDisplayCount?.length || 0);

  return (
    <div className={styles.eventGoingContainer}>
      <div className={styles.eventGoingLabel}>
        {t('event_going_list_attending')}
      </div>
      <div className={styles.eventGoingListWrapper}>
        {eventGoingDisplayCount?.map((attendee, index) => {
          return <EventAttendeeItem key={index} attendeeId={attendee.userId} />;
        })}
        {eventAttendingMembers?.length > 5 &&
          remainingEventAttendeesCount !== 0 && (
            <div className={styles.remainingCountCircle}>
              {I18NFormatter.formatNumber(remainingEventAttendeesCount)}
            </div>
          )}
      </div>
    </div>
  );
}

export default EventGoingList;
