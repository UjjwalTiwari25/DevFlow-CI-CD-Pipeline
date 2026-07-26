import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import useShallowEqualSelector from './shallowEqualSelector';
import {
  getAllExperimentsAction,
  chooseUserExperiments,
} from '../store/slices/experiments';
import usePageQuery from './pageQuery';

// installSource: Should be used when assigning targeted traffic experiments without a user profile
export default function useExperiments(expNames, user, installSource) {
  const {
    utm_assign_experiment: utmAssignExperiment,
    utm_assign_experiment_value: utmAssignExperimentValue,
  } = usePageQuery();

  const expNameList = useMemo(() => {
    const tempExpNames = [...(expNames || [])];
    if (utmAssignExperiment && !tempExpNames.includes(utmAssignExperiment)) {
      tempExpNames.push(utmAssignExperiment);
    }
    return tempExpNames;
  }, [expNames, utmAssignExperiment]);

  const preAssignedExperiments = useMemo(() => {
    if (utmAssignExperiment && utmAssignExperimentValue) {
      return { [utmAssignExperiment]: utmAssignExperimentValue };
    }
    return {};
  }, [utmAssignExperiment, utmAssignExperimentValue]);

  const { all, chosen, isLoading } = useShallowEqualSelector(
    ({ experiments }) => ({
      ...experiments,
    })
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (all) {
      return;
    }
    dispatch(getAllExperimentsAction());
  }, [dispatch, all]);

  useEffect(() => {
    if (!all || !expNameList) {
      return;
    }
    // Set attribution data from installSource if user profile is not available
    let attributionData = null;
    if (!user && installSource) {
      attributionData = { installSource };
    }
    dispatch(
      chooseUserExperiments({
        expNames: expNameList,
        user,
        attributionData,
        preAssignedExperiments,
      })
    );
  }, [all, expNameList, user, dispatch, installSource, preAssignedExperiments]);

  return [chosen || {}, isLoading];
}
