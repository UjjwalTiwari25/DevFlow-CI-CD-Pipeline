/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export function showLoginModal() {
  return async (dispatch, getState) => {
    const { profiles } = getState();
    const { loginModalRef } = profiles;
    if (loginModalRef) {
      loginModalRef.show();
    }
  };
}

const initialState = {
  tabName: null,
  currentScrollPosition: 0,
  loginModalRef: null,
  showLoginForm: false,
};

export const newCoachProfilesSlice = createSlice({
  name: 'newCoachProfiles',
  initialState,
  reducers: {
    setTabName: (state, action) => {
      state.tabName = action.payload;
    },
    setScrollPosition: (state, action) => {
      state.currentScrollPosition = action.payload;
    },
    setLoginModalRef: (state, action) => {
      state.loginModalRef = action.payload;
    },
    setShowLoginForm: (state, action) => {
      state.setLoginModalRef = action.payload;
    },
  },
});

export const {
  setScrollPosition,
  setTabName,
  setLoginModalRef,
  setShowLoginForm,
} = newCoachProfilesSlice.actions;

export default newCoachProfilesSlice.reducer;
