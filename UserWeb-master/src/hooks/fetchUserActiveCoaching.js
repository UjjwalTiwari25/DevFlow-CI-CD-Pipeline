import { useReducer, useEffect } from 'react';
import { subDays } from 'date-fns';
import {
  getUserCoachingSubscription,
  getUserCoachingAppointments,
} from '@/models/user';

import useAuthUser from './authUser';
import { notifyHandledError } from '../services/ErrorMonitoring';

const initialState = {
  hasActiveCoaching: false,
  isLoading: false,
  isFetched: false,
  appointment: null,
  subscription: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setLoading':
      return { ...state, isLoading: action.data };
    case 'setIsFetched':
      return { ...state, isFetched: action.data };
    case 'setHasActiveCoaching':
      return { ...state, hasActiveCoaching: action.data };
    case 'setAppointent':
      return { ...state, appointment: action.data };
    case 'setSubscription':
      return { ...state, subscription: action.data };
    default:
      return state;
  }
}

export default function useFetchUserActiveCoaching({
  excludeDiscovery,
  coachId,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { hasActiveCoaching, isLoading, isFetched, appointment, subscription } =
    state;
  const { user } = useAuthUser();

  const checkVideoCoachingAccess = async (userId) => {
    if (isLoading || isFetched) return false;
    if (!userId) {
      return false;
    }
    dispatch({ type: 'setLoading', data: true });
    let activeSubscription = false;
    try {
      const coachingSubscriptionResponse =
        await getUserCoachingSubscription(userId);

      const appoinmentList = await getUserCoachingAppointments({
        userId: user.id,
        status: 'BK',
        sessionTypeId: ['free-discovery'],
        start: subDays(new Date(), 7),
      });
      if (appoinmentList && appoinmentList.length > 0) {
        appoinmentList.sort((a, b) => new Date(b.start) - new Date(a.start));
        dispatch({ type: 'setAppointent', data: appoinmentList });
      }

      dispatch({ type: 'setSubscription', data: coachingSubscriptionResponse });

      if (
        (appoinmentList && appoinmentList?.length > 0) ||
        coachingSubscriptionResponse?.length > 0
      ) {
        activeSubscription = true;
      }

      if (
        appoinmentList &&
        appoinmentList.length > 0 &&
        excludeDiscovery &&
        appoinmentList[0]?.coachId === coachId &&
        coachingSubscriptionResponse?.length === 0
      ) {
        activeSubscription = false;
      }
    } catch (error) {
      notifyHandledError(error, {
        message: 'Error while checking active video coaching subscription',
      });
    }
    dispatch({ type: 'setHasActiveCoaching', data: activeSubscription });
    dispatch({ type: 'setIsFetched', data: true });
    dispatch({ type: 'setLoading', data: false });
    return activeSubscription;
  };

  useEffect(() => {
    if (user) {
      checkVideoCoachingAccess(user.id);
    } else {
      dispatch({ type: 'setHasActiveCoaching', data: false });
      dispatch({ type: 'setIsFetched', data: false });
    }
  }, [user]);

  return {
    hasActiveCoaching,
    isLoadingUserActiveCoaching: isLoading,
    isFetchedUserActiveCoaching: isFetched,
    appointment,
    subscription,
  };
}
