import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import app from './slices/app';
import onboard from './onboard/reducer';
import payment from './slices/payment';
import viewAll from './slices/viewAll';
import navbar from './slices/navbar';
import auth from './slices/auth';
import backendExperiments from './slices/backendExperiments';
import experiments from './slices/experiments';
import coaching from './slices/coaching';
import theme from './slices/theme';
import countries from './slices/countries';
import coaches from './slices/coaches';
import live from './slices/live';
import profiles from './slices/newCoachProfiles';
import config from '../config';

const combinedReducers = combineReducers({
  app,
  onboard,
  auth,
  payment,
  experiments,
  navbar,
  viewAll,
  coaches,
  countries,
  theme,
  coaching,
  live,
  profiles,
  backendExperiments,
});

const reducer = (state, action) => {
  let nextState;
  switch (action.type) {
    case HYDRATE:
      nextState = {
        ...state,
        ...action.payload,
      };
      if (state.auth.user && !nextState.auth.user) {
        nextState.auth = state.auth;
      }
      if (state.experiments.all && !nextState.experiments.all) {
        nextState.experiments = state.experiments;
      }
      if (state.backendExperiments.all && !nextState.backendExperiments.all) {
        nextState.backendExperiments = state.backendExperiments;
      }
      if (
        (state.coaches.all && !nextState.coaches.all) ||
        (state.coaches.currentCoachDetails &&
          !nextState.coaches.currentCoachDetails)
      ) {
        nextState.coaches = state.coaches;
      }
      if (state.live.liveEventDetails && !nextState.live.liveEventDetails) {
        nextState.live = state.live;
      }
      if (state.navbar.currentTab && !nextState.navbar.currentTab) {
        nextState.navbar = state.navbar;
      }
      if (state.viewAll.data && !nextState.viewAll.data) {
        nextState.viewAll = state.viewAll;
      }
      if (state.countries.allCountries && !nextState.countries.allCountries) {
        nextState.countries = state.countries;
      }
      if (state.theme.isDark && !nextState.theme.isDark) {
        nextState.theme = state.theme;
      }
      if (
        (state.profiles.currentScrollPosition &&
          !nextState.profiles.currentScrollPosition) ||
        (state.profiles.tabName && !nextState.profiles.tabName)
      ) {
        nextState.profiles = state.profiles;
      }
      if (state.live.loginModalRef && !nextState.live.loginModalRef) {
        nextState.live = state.live;
      }
      if (state.payment.subscription && !nextState.payment.subscription) {
        nextState.payment = {
          ...nextState.payment,
          subscription: state.payment.subscription,
        };
      }
      if (state.payment.pricing && !nextState.payment.pricing) {
        nextState.payment = {
          ...nextState.payment,
          pricing: state.payment.pricing,
        };
      }
      if (
        state.payment.currentPricingCountryCode &&
        !nextState.payment.currentPricingCountryCode
      ) {
        nextState.payment = {
          ...nextState.payment,
          currentPricingCountryCode: state.payment.currentPricingCountryCode,
        };
      }
      return nextState;
    default:
      return combinedReducers(state, action);
  }
};

const initStore = () => {
  return configureStore({
    reducer,
    devTools: config.environment === 'development',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: ['profiles.loginModalRef'],
          ignoredActions: ['newCoachProfiles/setLoginModalRef'],
        },
      }),
  });
};

export const wrapper = createWrapper(initStore);
