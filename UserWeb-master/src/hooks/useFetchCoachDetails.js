import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { getCoach } from '@/models/coach';
import { addCoachToAllCoachesList } from '@/store/slices/coaches';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import useShallowEqualSelector from './shallowEqualSelector';

export default function useFetchCoachDetails({ coachId }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const { allCoaches } = useShallowEqualSelector(({ coaches }) => ({
    allCoaches: coaches.allCoaches,
  }));

  useEffect(() => {
    const fetchCoachDetails = async () => {
      if (!coachId) return;

      // Check if coach exists in allCoaches
      const existingCoach = allCoaches?.find((coach) => coach.id === coachId);
      if (existingCoach) return;

      try {
        setIsLoading(true);

        // Fetch coach details from backend
        const coachDetails = await getCoach(coachId);

        if (coachDetails) {
          dispatch(addCoachToAllCoachesList(coachDetails));
        }
      } catch (err) {
        notifyHandledError(err, {
          message: 'Error fetching coach details',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoachDetails();
  }, [coachId, allCoaches, dispatch]);

  // Get coach details from allCoaches
  const coachDetails = useMemo(() => {
    if (!allCoaches || !coachId) {
      return null;
    }
    const coach = allCoaches.find((item) => item.id === coachId);
    return coach;
  }, [allCoaches, coachId]);

  return {
    coachDetails,
    isLoading,
  };
}
