import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchService, fetchServiceReviews } from '../models/service';
import { setCoachService, setSelectedDuration } from '../store/slices/coaching';
import useAuthUser from './authUser';
import useShallowEqualSelector from './shallowEqualSelector';

export default function useCoachingSession(serviceId) {
  const [allCoachService, setAllCoachService] = useState(null);
  const { user } = useAuthUser();
  const { coachService } = useShallowEqualSelector(({ coaching }) => coaching);

  const dispatch = useDispatch();

  useEffect(() => {
    if (allCoachService) {
      dispatch(setSelectedDuration(allCoachService.pricing[0].duration));
    }
  }, [allCoachService, dispatch]);

  useEffect(() => {
    async function getCoachService() {
      const res = await fetchService(serviceId);
      const reviews = await fetchServiceReviews(serviceId);
      if (!res.error) {
        if (reviews && !reviews.error) {
          res.reviews = reviews;
        }
        dispatch(setCoachService(res));
        setAllCoachService(res);
      }
    }
    if (serviceId && (!allCoachService || !coachService)) {
      getCoachService();
    }
  }, [allCoachService, dispatch, serviceId, user, coachService]);

  return { allCoachService };
}
