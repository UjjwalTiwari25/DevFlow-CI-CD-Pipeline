/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  chooseExperimentsList,
  getActiveBackEndExperiments,
} from '../../models/experiments';
import Logger from '../../services/Logger';

export const getAllBackendExperiments = createAsyncThunk(
  'backendExperiments/getAllBackendExperiments',
  async () => {
    Logger.debug('Fetching backend experiments');
    const result = await getActiveBackEndExperiments();
    Logger.debug('Fetched backend experiments', { result });
    return result;
  }
);

export const chooseUserBackendExperiments = createAsyncThunk(
  'backendExperiments/chooseUserBackendExperiments',
  async ({ user, attributionData }, { getState, rejectWithValue }) => {
    try {
      Logger.debug('Assigning backend experiments');
      const result = await chooseExperimentsList(
        getState().backendExperiments.all,
        user,
        user && user.id,
        attributionData,
        { appLocale: getState().app.locale }
      );
      Logger.debug('Assigned backend experiments', { result });
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

export const backendExperimentsSlice = createSlice({
  name: 'backendExperiments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBackendExperiments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBackendExperiments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.all = action.payload;
        state.error = null;
      })
      .addCase(chooseUserBackendExperiments.fulfilled, (state, action) => {
        state.chosen = {
          ...state.chosen,
          ...action.payload,
        };
      });
  },
});

export default backendExperimentsSlice.reducer;
