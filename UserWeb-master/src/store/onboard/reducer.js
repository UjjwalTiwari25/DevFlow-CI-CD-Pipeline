import { onboardActionTypes } from './actions';
import appConstants from '../../utils/constants/app';

const initState = {
  profile: {
    attributionData: {
      feature: `onboarding_web`,
      sourcePlatform: appConstants.APP_NAME,
    },
  },
  error: null,
};

export default (state = initState, action = {}) => {
  switch (action.type) {
    case onboardActionTypes.UPDATE_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.data,
        },
      };
    default:
      return state;
  }
};
