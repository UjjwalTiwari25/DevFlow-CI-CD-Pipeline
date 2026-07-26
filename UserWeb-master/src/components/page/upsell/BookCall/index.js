import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MdChevronLeft } from 'react-icons/md';
import useBrowserHistory from '../../../../hooks/browserHistory';
import useShallowEqualSelector from '../../../../hooks/shallowEqualSelector';
import { setLoadingMore } from '../../../../store/slices/coaching';
import Text from '../../../app/Text';
import BookCoachCall from '../NewCoachingFlowComponents/BookCoachCall';
import SelectDateTime from '../NewCoachingFlowComponents/SelectDateTime';
import styles from './styles';
import useCoachAvailability from '../../../../hooks/coachAvailability';
import Analytics from '../../../../services/Analytics';
import useAuthUser from '../../../../hooks/authUser';

export default function BookCall({
  onBack,
  onNext,
  setCoachingSubscriptionDetails,
  experiments,
}) {
  useBrowserHistory('bookCall', true, onBack, onNext);
  const [isReachEnd, setIsReachEnd] = useState(false);
  const [limit, setLimit] = useState(7);
  const [hideBackButton, setHideBackButton] = useState(false);
  const dispatch = useDispatch();
  const { coach } = useShallowEqualSelector(({ payment }) => payment);
  const { user } = useAuthUser();
  const [timeSelected, setTimeSelected] = useState(null);
  const data = {
    duration: 30,
    sessionTypeId: 'free-discovery',
  };

  useEffect(() => {
    if (isReachEnd && limit < 60) {
      setLimit(limit + 7);
      setIsReachEnd(false);
      dispatch(setLoadingMore(true));
    }
  }, [isReachEnd, setLimit, dispatch]);

  useCoachAvailability(limit, coach.id, data);
  return (
    <div className="w-100 col align-center">
      <div className="block-container relative">
        {!hideBackButton && (
          <div
            className="left-arrow clickable"
            onClick={() => {
              if (!timeSelected) {
                onBack();
              } else {
                setTimeSelected(null);
              }
            }}>
            <MdChevronLeft />
          </div>
        )}
        {!timeSelected && (
          <SelectDateTime
            setIsReachEnd={setIsReachEnd}
            coach={coach}
            setTimeSelected={setTimeSelected}
            onBack={onBack}
            user={user}
          />
        )}
        {timeSelected && (
          <BookCoachCall
            coach={coach}
            setCoachingSubscriptionDetails={setCoachingSubscriptionDetails}
            data={data}
            onNext={onNext}
            timeSelected={timeSelected}
            setHideBackButton={setHideBackButton}
            experiments={experiments}
          />
        )}
      </div>
      {!timeSelected && (
        <div
          className="back-button clickable"
          onClick={() => {
            Analytics.track('Onboarding Coaching Time Not Working', {
              UserId: user?.id,
              coachId: coach?.id,
              isNewCoachingFlow: true,
            });
            onBack();
          }}>
          <Text
            type="body2"
            color="b100"
            style={{ textDecoration: 'underline' }}>
            {`These times don’t work`}
          </Text>
        </div>
      )}
      <style jsx>{styles}</style>
    </div>
  );
}
