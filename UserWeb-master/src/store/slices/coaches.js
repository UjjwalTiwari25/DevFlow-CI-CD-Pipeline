/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import appConstants from '@/utils/constants/app';
import { getCoach, listCoaches } from '../../models/coach';
import Logger from '../../services/Logger';

export const getAllCoaches = createAsyncThunk(
  'coaches/getAllCoaches',
  // eslint-disable-next-line default-param-last
  async ({ bypassCDN } = {}, { getState }) => {
    const appLocale = getState().app.locale;
    Logger.debug('Fetch coaches action', { bypassCDN });
    const result = await listCoaches({ bypassCDN, locale: appLocale });
    Logger.debug('Done fetch coaches action', { bypassCDN });
    return result;
  }
);

export const getCoachDetails = createAsyncThunk(
  'coaches/getCoach',
  async (coachId, { getState, dispatch }) => {
    let result;
    const appLocale = getState().app.locale;
    Logger.debug('Fetch coach action', { coachId, appLocale });
    if (appLocale !== appConstants.DEFAULT_LOCALE) {
      let { allCoaches } = getState().coaches;
      if (!allCoaches) {
        allCoaches = await dispatch(getAllCoaches()).unwrap();
      }
      result = allCoaches.find((coach) => coach.id === coachId);
    }
    if (!result) {
      result = await getCoach(coachId);
    }
    Logger.debug('Done fetch coach action', { coachId });
    return result;
  }
);

const initialState = {
  isLoading: false,
  allCoaches: null,
  currentCoachDetails: null,
};

export const coachesSlice = createSlice({
  name: 'coaches',
  initialState,
  reducers: {
    setCoachDetailsAction: (state, action) => {
      state.currentCoachDetails = action.payload;
    },
    addCoachToAllCoachesList: (state, action) => {
      const existingCoach = state.allCoaches?.find(
        (coach) => coach.id === action.payload.id
      );
      if (!existingCoach) {
        state.allCoaches = [...(state.allCoaches || []), action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoaches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCoaches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCoaches = action.payload;
        state.error = null;
      });
  },
});

export const { setCoachDetailsAction, addCoachToAllCoachesList } =
  coachesSlice.actions;

export default coachesSlice.reducer;
