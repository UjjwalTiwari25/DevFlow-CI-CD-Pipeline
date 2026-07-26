/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  selectedRow: '',
  rowLabel: '',
};

export const viewAllAction = createSlice({
  name: 'viewAll',
  initialState,
  reducers: {
    setViewAllData: (state, action) => {
      state.data = action.payload && action.payload.objectArray;
      state.selectedRow = action.payload && action.payload.selectedRow;
      state.rowLabel = action.payload && action.payload.rowLabel;
    },
  },
});

export const { setViewAllData } = viewAllAction.actions;

export default viewAllAction.reducer;
