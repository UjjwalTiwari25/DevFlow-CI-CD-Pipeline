/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentTab: null,
};

export const navbarAction = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
  },
});

export const { setCurrentTab } = navbarAction.actions;

export default navbarAction.reducer;
