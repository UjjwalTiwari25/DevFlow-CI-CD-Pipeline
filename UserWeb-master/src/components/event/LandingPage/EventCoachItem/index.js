import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import useResponsiveWindow from '@/hooks/responsiveWindow';
import {
  getCoach,
  getCoachName,
  getCoachPhoto,
  getCoachProfessionalTitle,
} from '@/models/coach';
import Text from '@/components/app/Text';
import Logger from '@/services/Logger';
import styles from './styles.module.scss';

function EventCoachItem({ coachId }) {
  const [coachDetails, setCoachDetails] = useState();
  const [, isMobile] = useResponsiveWindow();

  useEffect(() => {
    const fetchEventCoachDetails = async () => {
      try {
        if (!coachId) return;
        const coachResponse = await getCoach(coachId);
        if (!coachResponse) {
          return;
        }
        setCoachDetails(coachResponse);
      } catch (err) {
        Logger.error('Unable to fetch coach details', err);
      }
    };

    if (coachId && !coachDetails) {
      fetchEventCoachDetails();
    }
  }, [coachId, coachDetails]);

  return (
    <div className={styles.hostEventCoach}>
      <Image
        src={getCoachPhoto(coachDetails, 'photo200Url')}
        width={isMobile ? 40 : 32}
        height={isMobile ? 40 : 32}
        style={{ borderRadius: '50%' }}
        alt=""
      />
      <div>
        <Text className={styles.hostCoachName}>
          {getCoachName(coachDetails)}
        </Text>
        <Text className={styles.hostCoachProfessionalTitle}>
          {getCoachProfessionalTitle(coachDetails)}
        </Text>
      </div>
    </div>
  );
}

export default EventCoachItem;
