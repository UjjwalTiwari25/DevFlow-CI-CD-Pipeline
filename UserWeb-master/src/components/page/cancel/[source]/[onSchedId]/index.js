import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { generateQueryPath } from '../../../../../utils';
import routeConstants from '../../../../../utils/constants/routes';
import CancelBooking from '../../../../coachingCancel/CancelBooking';
import styles from './styles';
import CancelReason from '../../../../coachingCancel/CancelReason';
import { getCoach } from '../../../../../models/coach';
import Canceled from '../../../../coachingCancel/Canceled';

const screens = ['cancelBooking', 'cancelReason', 'againSchedule'];
export default function CancelPage({ appointmentDetails }) {
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [coach, setCoach] = useState(null);
  const router = useRouter();
  const { query } = router;
  const { source, onSchedId } = query;

  useEffect(() => {
    async function getCoachDetails() {
      const res = await getCoach(appointmentDetails.coachId);
      if (res && !res.error) {
        setCoach(res);
      }
    }
    if (appointmentDetails) {
      getCoachDetails();
    }
  }, [appointmentDetails]);

  function handleRedirect() {
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHING}/reschedule/${source}/${onSchedId}`
    );
    router.push(path);
  }

  return (
    <div className="col align-center w-100">
      <div className="col align-center container">
        <img
          src="/static/images/reschedule/resched-background.png"
          alt="aura background"
          className="aura-background"
        />
        <ReschedulePageScreens
          screen={screens[currentScreenIndex]}
          onNext={() => {
            if (currentScreenIndex + 1 < screens.length) {
              setCurrentScreen(currentScreenIndex + 1);
            }
          }}
          onBack={() => {
            if (currentScreenIndex === 0) {
              window.history.go(-1);
            }
            setCurrentScreen(currentScreenIndex - 1);
            window.scrollTo(0, 0);
          }}
          screens={screens}
          handleRedirect={handleRedirect}
          appointmentDetails={appointmentDetails}
          coach={coach}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

function ReschedulePageScreens({ screen, ...props }) {
  switch (screen) {
    case 'cancelBooking':
      return <CancelBooking {...props} />;
    case 'cancelReason':
      return <CancelReason {...props} />;
    case 'againSchedule':
      return <Canceled {...props} />;
    default:
      return null;
  }
}
