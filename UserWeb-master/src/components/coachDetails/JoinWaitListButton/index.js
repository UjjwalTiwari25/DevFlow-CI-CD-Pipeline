import classNames from 'classnames';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import useAuthUser from '../../../hooks/authUser';
import useShallowEqualSelector from '../../../hooks/shallowEqualSelector';
import { getCoachName } from '../../../models/coach';
import { setUserInWaitList } from '../../../models/service';
import Analytics from '../../../services/Analytics';
import {
  setShowWaitListModal,
  setWaitListStatus,
} from '../../../store/slices/coaching';
import { showLoginModal } from '../../../store/slices/newCoachProfiles';
import Text from '../../app/Text';
import styles from './styles';

function JoinWaitListButton({ coach }) {
  const { user } = useAuthUser();
  const dispatch = useDispatch();
  const { waitListStatus } = useShallowEqualSelector(
    ({ coaching }) => coaching
  );

  const joinWaitList = useCallback(async () => {
    if (!user) {
      dispatch(showLoginModal());
    }
    if (user) {
      await setUserInWaitList(coach.id, user.id);
      Analytics.track('Join Coaching Wait List', {
        UserId: user.id,
        CoachId: coach.id,
        CoachName: getCoachName(coach),
      });
      dispatch(setShowWaitListModal(true));
      dispatch(setWaitListStatus(true));
    }
  }, [user, dispatch, coach.id]);

  return (
    <>
      <div
        className={classNames('row booking-coach-wait-list align-center', {
          'disable-waiting-list-button': waitListStatus,
          clickable: !waitListStatus,
        })}
        onClick={() => {
          return !waitListStatus && joinWaitList();
        }}>
        <Text
          type="body"
          color="b100"
          weight="semibold"
          style={{ color: waitListStatus && '#909090' }}>
          Join waitlist for 1-1 coaching
        </Text>
      </div>
      <style jsx>{styles}</style>
    </>
  );
}

export default JoinWaitListButton;
