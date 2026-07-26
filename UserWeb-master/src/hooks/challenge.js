import { useEffect, useReducer } from 'react';
import { getChallengeDetails } from '@/models/challenges';
import { notifyHandledError } from '../services/ErrorMonitoring';
import Logger from '../services/Logger';

const initialState = {
  challenge: null,
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setChallenge':
      return { ...state, ...action.data };
    case 'setLoading':
      return { ...state, loading: action.data };
    default:
      return state;
  }
}

export default function useChallenge(challengeId) {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    if (!challengeId) {
      return;
    }
    dispatch({ type: 'setLoading', data: true });
    getChallengeDetails(challengeId)
      .then((challengeResponse) => {
        dispatch({
          type: 'setChallenge',
          data: {
            challenge: challengeResponse,
            loading: false,
            error: challengeResponse ? null : true,
          },
        });
        Logger.debug('Challenge Detail loaded', { challengeResponse });
      })
      .catch((err) => {
        notifyHandledError(err, {
          message: 'Failed to load challenge dettails',
        });
        dispatch({
          type: 'setChallenge',
          data: {
            challenge: null,
            loading: false,
            error: true,
          },
        });
      });
  }, [challengeId]);
  return state;
}
