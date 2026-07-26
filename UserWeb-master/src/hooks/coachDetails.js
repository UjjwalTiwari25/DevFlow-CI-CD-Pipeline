import { useMemo } from 'react';
import useShallowEqualSelector from './shallowEqualSelector';

export default function useCoachDetails(coachId) {
  const { allCoaches } = useShallowEqualSelector(({ coaches }) => ({
    ...coaches,
  }));

  const coachDetails = useMemo(() => {
    if (!allCoaches || !coachId) {
      return null;
    }
    const coach = allCoaches.find((item) => item.id === coachId);
    return coach;
  }, [allCoaches, coachId]);

  return { coachDetails };
}
