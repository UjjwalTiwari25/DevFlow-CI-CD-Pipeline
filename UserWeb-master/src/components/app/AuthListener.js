import { useEffect, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import Auth from '../../services/Auth';
import Logger from '../../services/Logger';
import {
  getUserWithAuth,
  handleLogout,
  setAuthLoading,
  handleUpdatePixelCookies,
} from '../../store/slices/auth';
import Analytics from '../../services/Analytics';
import useToastMessage from '../../hooks/toastMessage';

export default function AuthListener({
  onAuthChange,
  isUserFromQuery,
  allowSignup,
}) {
  const dispatch = useDispatch();
  const savedCallback = useRef();
  const Toast = useToastMessage();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = onAuthChange;
  }, [onAuthChange]);

  const onAuthStateChangedHandler = useCallback(
    async (authData) => {
      dispatch(setAuthLoading(true));
      Analytics.sendDebugEvent(
        'auth change',
        authData
          ? {
              uid: authData.uid,
              email: authData.email,
              providerData: authData.providerData,
            }
          : null
      );
      const auth = {
        isLoggedIn: false,
        isNewUser: false,
        data: null,
        user: null,
      };
      if (authData) {
        auth.isLoggedIn = true;
        auth.data = authData;
        const user = await dispatch(getUserWithAuth(authData)).unwrap();
        if (user) {
          auth.user = user;
          // Update pixel cookies in user profile
          await dispatch(handleUpdatePixelCookies(user.id));
        } else if (allowSignup) {
          auth.isNewUser = true;
        } else {
          // If only login and no user found for auth data, show an error message and sign out the user
          Toast.showError(
            'Could not find an existing user with the given email. Please sign up for Aura first.'
          );
          dispatch(handleLogout());
          dispatch(setAuthLoading(false));
          return;
        }
      }
      dispatch(setAuthLoading(false));

      if (typeof savedCallback.current === 'function') {
        savedCallback.current(auth);
      } else if (auth.user) {
        // Only identify for existing users if callback is not registered. Pages that provide the callback should handle identification themselves.
        // This is done to avoid identify being incorrectly called for pages that have sign ups and need to handle new user profile creation and identification.
        Analytics.signIn(auth.user);
      }
    },
    [dispatch, allowSignup, Toast]
  );

  useEffect(() => {
    // If user is being fetched from UTM params do not set up auth listener
    if (isUserFromQuery) {
      dispatch(setAuthLoading(false));
      return undefined;
    }
    Analytics.sendDebugEvent('Setting up auth listener');
    try {
      const unsubscribe = onAuthStateChanged(
        Auth.instance,
        onAuthStateChangedHandler
      );
      return () => {
        Analytics.sendDebugEvent('cleaning auth listener');
        dispatch(setAuthLoading(false));
        unsubscribe();
      };
    } catch (error) {
      Logger.error('Error setting up auth listener', { error });
      return null;
    }
  }, [onAuthStateChangedHandler, isUserFromQuery, dispatch]);

  return null;
}
