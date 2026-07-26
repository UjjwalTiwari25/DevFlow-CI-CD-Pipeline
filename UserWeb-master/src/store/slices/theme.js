/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDark: false,
  themeName: 'light',
};

export const themeAction = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setDarkTheme: (state) => {
      state.isDark = true;
      state.themeName = 'dark';
    },
    setLightTheme: (state) => {
      state.isDark = false;
      state.themeName = 'light';
    },
  },
});

export const { setDarkTheme, setLightTheme } = themeAction.actions;

export default themeAction.reducer;
