import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from './shallowEqualSelector';
import {
  chooseUserBackendExperiments,
  getAllBackendExperiments,
} from '../store/slices/backendExperiments';

// installSource: Should be used when assigning targeted traffic experiments without a user profile
export default function useBackEndExperiments(user, installSource) {
  const { all, chosen, isLoading } = useShallowEqualSelector(
    ({ backendExperiments }) => ({
      ...backendExperiments,
    })
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (all) {
      return;
    }
    dispatch(getAllBackendExperiments());
  }, [dispatch, all]);

  useEffect(() => {
    if (!all) {
      return;
    }
    // Set attribution data from installSource if user profile is not available
    let attributionData = null;
    if (!user && installSource) {
      attributionData = { installSource };
    }
    dispatch(chooseUserBackendExperiments({ user, attributionData }));
  }, [all, user, dispatch, installSource]);

  return [chosen || {}, isLoading];
}
