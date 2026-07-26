/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { chooseExperiments, getAllExperiments } from '../../models/experiments';
import Logger from '../../services/Logger';

export const getAllExperimentsAction = createAsyncThunk(
  'experiments/getAllExperimentsAction',
  async () => {
    Logger.debug('Fetching experiments');
    const result = await getAllExperiments();
    Logger.debug('Fetched experiments');
    return result;
  }
);

export const chooseUserExperiments = createAsyncThunk(
  'experiments/chooseUserExperiments',
  async (
    { expNames, user, attributionData, preAssignedExperiments },
    { getState, rejectWithValue }
  ) => {
    try {
      const { all } = getState().experiments;
      Logger.debug('Assigning experiments');
      const result = await chooseExperiments(
        all,
        expNames,
        user,
        user && user.id,
        attributionData,
        { appLocale: getState().app.locale, preAssignedExperiments }
      );
      Logger.debug('Assigned experiments', result);
      return result;
    } catch (error) {
      return rejectWithValue({ error });
    }
  }
);

const initialState = {
  isLoading: false,
  all: null,
  chosen: null,
};

export const experimentsSlice = createSlice({
  name: 'experiments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllExperimentsAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllExperimentsAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.all = action.payload;
        state.error = null;
      })
      .addCase(chooseUserExperiments.fulfilled, (state, action) => {
        state.chosen = {
          ...state.chosen,
          ...action.payload,
        };
      });
  },
});

export default experimentsSlice.reducer;
