/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { reserveLiveEvent } from '../../models/live';

export const reserveSpot = createAsyncThunk(
  'live/reserveSpot',
  async ({ liveEventId }, { rejectWithValue }) => {
    const res = await reserveLiveEvent({ liveEventId });
    if (!res || res.error) return rejectWithValue(null);
    return res;
  }
);

const initialState = {
  isLoading: false,
  liveEventDetails: null,
};

export const liveAction = createSlice({
  name: 'live',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLiveEventAction: (state, action) => {
      state.liveEventDetails = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reserveSpot.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reserveSpot.fulfilled, (state, action) => {
        state.liveEventDetails = action.payload;
      })
      .addCase(reserveSpot.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLoading, setLiveEventAction } = liveAction.actions;

export default liveAction.reducer;
