import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from './shallowEqualSelector';
import { getAllCoaches } from '../store/slices/coaches';

export default function useAllCoaches() {
  const { allCoaches, isLoading } = useShallowEqualSelector(({ coaches }) => ({
    ...coaches,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    if (allCoaches || isLoading) {
      return;
    }
    async function fetchCoaches() {
      await dispatch(getAllCoaches());
    }
    fetchCoaches();
  }, [dispatch, allCoaches, isLoading]);

  return { allCoaches, isLoading };
}
