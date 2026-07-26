/* eslint-disable no-param-reassign */
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import IPLookup from '@/services/IPLookup';
import Logger from '@/services/Logger';
import { generateMD5Hash } from '@/utils';
import PodscribePixel from '@/services/PodscribePixel';
import { saveChosenExperimentsToAnalytics } from '../../models/experiments';
import {
  getUser,
  getUserFromAuth,
  getUserFromEmail,
  setUser,
  setUserWithoutAuth,
  updateUser,
} from '../../models/user';

import Analytics from '../../services/Analytics';
import Auth from '../../services/Auth';
import FbPixel from '../../services/FbPixel';
import TiktokPixel from '../../services/TiktokPixel';
import appConstants from '../../utils/constants/app';

const userNotFoundAction = createAction('auth/userNotFoundAction');

const userNotCreatedAction = createAction('auth/userNotCreatedAction');

export const handleGetUser = createAsyncThunk(
  'auth/handleGetUser',
  async (id, { getState, dispatch }) => {
    const existingUser = getState().auth.user;
    // Reset user state only if existing user does not exist or does not match the current user
    const user = await getUser(id);
    if (user) {
      if (!existingUser) {
        Analytics.signIn(user);
      }
      // Reset existing user before identification when current user does not match existing user
      if (existingUser && existingUser.id !== id) {
        Analytics.resetUser();
        Analytics.signIn(user);
      }
    } else {
      dispatch(userNotFoundAction());
    }
    return user;
  }
);
export const handleLogout = createAsyncThunk('auth/handleLogout', async () => {
  await Auth.signOut();
  Analytics.resetUser();
  return true;
});

export const handleSetUserWithoutAuth = createAsyncThunk(
  'auth/handleSetUserWithoutAuth',
  async (profile, { dispatch }) => {
    const user = await setUserWithoutAuth(profile);
    if (!user || user.error) {
      dispatch(userNotCreatedAction());
    }
    return user;
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({ profile, id, saveToDatabase }, { rejectWithValue }) => {
    if (saveToDatabase) {
      try {
        await updateUser(profile, id);
      } catch (error) {
        return rejectWithValue({ error });
      }
    }
    return profile;
  }
);

export const handleGetUserFromEmail = createAsyncThunk(
  'auth/handleGetUserFromEmail',
  async (email, { dispatch }) => {
    const user = await getUserFromEmail(email);
    if (!user) {
      dispatch(userNotFoundAction());
    }
    return user;
  }
);

export const handleSetUser = createAsyncThunk(
  'auth/handleSetUser',
  async ({ profile, id }, { dispatch, getState, rejectWithValue }) => {
    const { locale } = getState().app;
    const attemptWrite = async () => {
      try {
        const res = await setUser({ locale, ...profile }, id);
        return { error: res || null, thrown: null };
      } catch (e) {
        return { error: e, thrown: e };
      }
    };
    let { error, thrown } = await attemptWrite();
    const wasRetry = Boolean(error);
    if (error) {
      Logger.warn(
        'handleSetUser: first profile write attempt failed, retrying',
        {
          id,
          provider: profile?.provider || null,
          errorCode: thrown?.code || null,
          errorMessage: thrown?.message || null,
        }
      );
      Analytics.sendDebugEvent('handleSetUser - retrying profile write', {
        id,
        provider: profile?.provider || null,
        errorCode: thrown?.code || null,
      });
      ({ error, thrown } = await attemptWrite());
      if (!error) {
        Analytics.sendDebugEvent(
          'handleSetUser - profile write succeeded on retry',
          { id }
        );
      }
    }
    Analytics.sendDebugEvent('Handle set user - received Firebase response', {
      error,
      wasRetry,
    });
    let user = null;
    if (!error) {
      user = { ...profile, id };
      const {
        givenName,
        email,
        provider,
        attributionData,
        ageMin,
        ageMax,
        durationPreference,
        contentTypePreference,
        gender,
        recommendationPreference,
        experiments,
      } = profile;
      const installSource =
        (attributionData && attributionData.installSource) || null;
      Analytics.identifyUser({ givenName, email, id }, true);
      Analytics.setPeopleProperties({
        UserID: id,
        $first_name: givenName,
        $created: new Date(),
        $email: email,
        Provider: provider,
        'Attribution Source Platform': appConstants.APP_NAME,
      });
      Analytics.setSuperProperties({
        UserID: id,
        Name: givenName,
        Provider: provider,
        'Join date': new Date().toISOString(),
        'Attribution Source Platform': appConstants.APP_NAME,
      });
      if (locale) {
        Analytics.setPeopleProperties({ Locale: locale });
        Analytics.setSuperProperties({ Locale: locale });
      }
      if (installSource) {
        Analytics.setPeopleProperties({
          'Attribution Install Source': installSource,
        });
        Analytics.setSuperProperties({
          'Attribution Install Source': installSource,
        });
      }
      if (attributionData && attributionData.coachId) {
        Analytics.setPeopleProperties({
          'Attribution CoachId': attributionData.coachId,
        });
        Analytics.setSuperProperties({
          'Attribution CoachId': attributionData.coachId,
        });
      }
      if (attributionData && attributionData.referralCode) {
        const referralAttributionData = {
          'Attribution Referral Code': attributionData.referralCode,
          'Attribution Referral Type': attributionData.referralType,
          'Attribution ReferrerId': attributionData.referrerId,
        };
        if (attributionData.playlistName) {
          referralAttributionData['Attribution Referral Playlist'] =
            attributionData.playlistName;
        }
        Analytics.setPeopleProperties(referralAttributionData);
        Analytics.setSuperProperties(referralAttributionData);
      }
      if (attributionData && attributionData.promocode) {
        Analytics.setPeopleProperties({
          'Attribution Install Promo Code': attributionData.promocode,
        });
        Analytics.setSuperProperties({
          'Attribution Install Promo Code': attributionData.promocode,
        });
      }
      if (attributionData && attributionData.challengeId) {
        Analytics.setPeopleProperties({
          'Attribution Install ChallengeId': attributionData.challengeId,
        });
        Analytics.setSuperProperties({
          'Attribution Install ChallengeId': attributionData.challengeId,
        });
      }
      if (attributionData && attributionData.trackId) {
        Analytics.setPeopleProperties({
          'Attribution Install TrackId': attributionData.trackId,
        });
        Analytics.setSuperProperties({
          'Attribution Install TrackId': attributionData.trackId,
        });
      }
      if (attributionData && attributionData.liveEventId) {
        Analytics.setPeopleProperties({
          'Attribution Install LiveEventId': attributionData.liveEventId,
        });
        Analytics.setSuperProperties({
          'Attribution Install LiveEventId': attributionData.liveEventId,
        });
      }
      if (ageMin || ageMax) {
        Analytics.setSuperProperties({
          'Age Min': ageMin,
          'Age Max': ageMax,
        });
        Analytics.setPeopleProperties({
          'Age Min': ageMin,
          'Age Max': ageMax,
        });
      }
      if (durationPreference) {
        Analytics.setPeopleProperties({
          'Duration Onboard Preference': durationPreference,
        });
      }
      if (contentTypePreference) {
        const contentTypeList = Object.keys(contentTypePreference);
        const contentTypeCount = contentTypeList.length;
        Analytics.setPeopleProperties({
          'Type Preference List': contentTypeList,
          'Type Preference Count': contentTypeCount,
        });
      }
      if (gender) {
        Analytics.setPeopleProperties({
          Gender: gender,
        });
        Analytics.setSuperProperties({
          Gender: gender,
        });
      }
      if (recommendationPreference) {
        const topicList = Object.keys(recommendationPreference);
        const topicsCount = topicList.length;
        Analytics.setPeopleProperties({
          'Topic List': topicList,
          'Topic Count': topicsCount,
        });
      }
      if (experiments) {
        saveChosenExperimentsToAnalytics(experiments);
      }
      Analytics.track(`Sign up login`, {
        Source: installSource,
        Time: new Date().toTimeString().slice(0, 2),
        Day: new Date().getDay(),
        Provider: provider,
        UserEmail: email,
        'Referral Code': attributionData.referralCode,
        'Referral Type': attributionData.referralType,
        ReferrerId: attributionData.referrerId,
      });
      FbPixel.trackStandard(
        'CompleteRegistration',
        {
          status: true,
          content_name: id,
        },
        { user }
      );
      TiktokPixel.trackStandard('CompleteRegistration', { content_id: id });
      PodscribePixel.signUp({
        hashed_email: generateMD5Hash(email),
      });
    } else {
      dispatch(userNotCreatedAction());
      return rejectWithValue({
        message: 'Failed to create user profile',
        errorCode: thrown?.code || null,
        errorMessage: thrown?.message || null,
      });
    }
    return user;
  }
);

export const getUserWithAuth = createAsyncThunk(
  'auth/getUserWithAuth',
  async (auth, { dispatch }) => {
    const user = await getUserFromAuth(auth);
    if (!user) {
      dispatch(userNotFoundAction());
    }
    return user;
  }
);

export const handleUpdatePixelCookies = createAsyncThunk(
  'auth/handleUpdatePixelCookies',
  async (id, { getState, dispatch }) => {
    const { user } = getState().auth;
    Logger.debug('Updating user pixel data', user);
    const profileData = {};
    const { pixelCookies: existingPixelCookies } = user || {};

    async function updateFbPixel() {
      const newPixelCookies = Analytics.getPixelCookies();
      if (!newPixelCookies || !newPixelCookies.fbp) return;

      if (
        !existingPixelCookies ||
        !existingPixelCookies.fbc ||
        newPixelCookies.fbc
      ) {
        Logger.debug('Found new FB pixel data', {
          newPixelCookies,
          existingPixelCookies,
        });
        profileData.pixelCookies = newPixelCookies;
        profileData.ip = await IPLookup.getUserIPAddress();
        if (
          typeof window !== 'undefined' &&
          window.navigator &&
          window.navigator.userAgent &&
          window.navigator.userAgent.length
        ) {
          profileData.userAgent = window.navigator.userAgent;
        }
      }
    }

    async function updateTwitterPixel() {
      // Twitter pixel
      const newTwitterCookies = Analytics.getTwitterCookies();
      if (!newTwitterCookies || !newTwitterCookies.twclid) return;
      Logger.debug('Found new twitter pixel data', {
        newTwitterCookies,
      });
      profileData.twitterCookies = newTwitterCookies;
    }

    async function updateGooglePixel() {
      // Twitter pixel
      const newGoogleCookies = Analytics.getGoogleCookies();
      if (
        !newGoogleCookies.gbraid &&
        !newGoogleCookies.gclid &&
        !newGoogleCookies.wbraid
      )
        return;
      Logger.debug('Found new google pixel data', {
        newGoogleCookies,
      });
      profileData.googleCookies = newGoogleCookies;
    }

    await updateFbPixel();
    await updateTwitterPixel();
    await updateGooglePixel();

    Logger.debug('Setting new pixel data on user', {
      profileData,
    });
    await dispatch(
      updateUserProfile({
        profile: profileData,
        id,
        saveToDatabase: true,
      })
    );
  }
);

const initialState = {
  authLoading: true, // Loader for authListener - this is set to false when Firebase auth listener fires
  isLoading: false,
  user: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },
    userNotFoundAction: (state) => {
      state.isLoading = false;
      state.user = null;
      state.error = true;
    },
    userNotCreatedAction: (state) => {
      state.isLoading = false;
      state.error = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleGetUser.pending, (state, action) => {
        const id = action.meta?.arg;
        const existingUser = state.user;
        if (!existingUser || existingUser.id !== id) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(handleGetUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(handleSetUserWithoutAuth.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleSetUserWithoutAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...state.user,
          ...action.payload,
        };
      })
      .addCase(handleGetUserFromEmail.pending, (state, action) => {
        const email = action.meta?.arg;
        const existingUser = state.user;
        if (!existingUser || existingUser.email !== email) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addCase(handleGetUserFromEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(handleSetUser.pending, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleSetUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(handleSetUser.rejected, (state) => {
        state.isLoading = false;
        state.error = true;
      })
      .addCase(getUserWithAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserWithAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      });
  },
});

export const { setAuthLoading } = authSlice.actions;

export default authSlice.reducer;
