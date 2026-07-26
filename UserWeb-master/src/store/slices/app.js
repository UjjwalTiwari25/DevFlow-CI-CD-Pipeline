/* eslint-disable no-param-reassign */
import { getISOLocale } from '@/models/locale';
import Analytics from '@/services/Analytics';
import { notifyHandledError } from '@/services/ErrorMonitoring';
import appConstants from '@/utils/constants/app';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  locale: appConstants.DEFAULT_LOCALE,
};

export const appAction = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppLocale: (state, action) => {
      const locale = getISOLocale(
        action.payload || appConstants.DEFAULT_LOCALE
      );
      try {
        Analytics.setSuperProperties({
          Locale: locale,
        });
      } catch (err) {
        notifyHandledError(err);
      }
      state.locale = locale;
    },
  },
});

export const { setAppLocale } = appAction.actions;

export default appAction.reducer;
