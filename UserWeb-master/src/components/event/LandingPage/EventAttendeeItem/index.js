import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import Text from '@/components/app/Text';
import { getUser, getUserFirstName, getUserPhoto } from '@/models/user';
import Logger from '@/services/Logger';
import styles from './styles.module.scss';

function EventAttendeeItem({ attendeeId }) {
  const [userDetails, setUserDetails] = useState();
  const [, isMobile] = useResponsiveWindow();

  useEffect(() => {
    const fetchEventAttendeeDetails = async () => {
      try {
        if (!attendeeId) return;
        const attendeeResponse = await getUser(attendeeId);
        if (!attendeeResponse) {
          return;
        }
        setUserDetails(attendeeResponse);
      } catch (err) {
        Logger.error('Unable to fetch attendee details', err);
      }
    };

    if (attendeeId && !userDetails) {
      fetchEventAttendeeDetails();
    }
  }, [attendeeId, userDetails]);

  return (
    <div className={styles.eventAttendeeWrapper}>
      <Image
        src={getUserPhoto(userDetails)}
        width={isMobile ? 40 : 32}
        height={isMobile ? 40 : 32}
        style={{ borderRadius: '50%' }}
        alt=""
      />
      <div>
        <Text className={styles.attendeeUserName}>
          {getUserFirstName(userDetails)}
        </Text>
      </div>
    </div>
  );
}

export default EventAttendeeItem;
