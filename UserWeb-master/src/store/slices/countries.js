/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCountriesList } from '../../models/coach';
import Logger from '../../services/Logger';

export const getAllCountriesAction = createAsyncThunk(
  'countries/getAllCountries',
  async () => {
    Logger.debug('Fetching countries');
    const result = await getCountriesList();
    Logger.debug('Fetched countries');
    return result;
  }
);
const initialState = {
  isLoading: false,
  allCountries: null,
};

export const countriesAction = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCountriesAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllCountriesAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCountries = action.payload;
        state.error = null;
      });
  },
});

export default countriesAction.reducer;
