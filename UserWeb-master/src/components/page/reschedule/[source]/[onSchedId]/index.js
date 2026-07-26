import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useCoachAvailability from '../../../../../hooks/coachAvailability';
import { getCoach } from '../../../../../models/coach';
import { setLoadingMore } from '../../../../../store/slices/coaching';
import { generateQueryPath } from '../../../../../utils';
import routeConstants from '../../../../../utils/constants/routes';
import ChooseDateTime from '../../../../coachingReschedule/ChooseDateTime';
import ConfirmRescheduleTime from '../../../../coachingReschedule/ConfirmRescheduleTime';
import Congrats from '../../../../coachingReschedule/Congrats';
import styles from './styles';

const screens = ['chooseDateTime', 'confirmRescheduleTime', 'congrats'];

export default function ReschedulePage({ appointmentDetails }) {
  const [currentScreenIndex, setCurrentScreen] = useState(0);
  const [isReachEnd, setIsReachEnd] = useState(false);
  const [coach, setCoach] = useState(null);
  const [limit, setLimit] = useState(7);
  const dispatch = useDispatch();
  const router = useRouter();
  const { query } = router;
  const { source, onSchedId } = query;
  const { coachId } = appointmentDetails || {};
  const data = {
    duration: appointmentDetails && appointmentDetails.duration,
    sessionTypeId: appointmentDetails && appointmentDetails.sessionTypeId,
  };

  useEffect(() => {
    async function getCoachDetails() {
      const res = await getCoach(coachId);
      if (res && !res.error) {
        setCoach(res);
      }
    }
    if (coachId) {
      getCoachDetails();
    }
  }, [coachId]);

  useEffect(() => {
    if (isReachEnd && limit < 60) {
      setLimit(limit + 7);
      setIsReachEnd(false);
      dispatch(setLoadingMore(true));
    }
  }, [isReachEnd, setLimit, dispatch]);

  function handleRedirect() {
    const path = generateQueryPath(
      `${routeConstants.PAGE_COACHING}/cancel/${source}/${onSchedId}`
    );
    router.push(path);
  }

  useCoachAvailability(limit, coachId, data);

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
          setIsReachEnd={setIsReachEnd}
          handleRedirect={handleRedirect}
          coach={coach}
          appointmentDetails={appointmentDetails}
        />
      </div>
      <style jsx>{styles}</style>
    </div>
  );
}

function ReschedulePageScreens({ screen, ...props }) {
  switch (screen) {
    case 'chooseDateTime':
      return <ChooseDateTime {...props} />;
    case 'confirmRescheduleTime':
      return <ConfirmRescheduleTime {...props} />;
    case 'congrats':
      return <Congrats {...props} />;
    default:
      return null;
  }
}
