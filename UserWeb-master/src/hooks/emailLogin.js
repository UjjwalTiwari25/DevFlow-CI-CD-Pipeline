import { useCallback, useEffect, useReducer } from 'react';
import isEmail from 'validator/lib/isEmail';
import { setAuthLoading } from '@/store/slices/auth';
import { useDispatch } from 'react-redux';
import { getUserFromEmail } from '../models/user';
import Analytics from '../services/Analytics';
import Auth from '../services/Auth';
import useToastMessage from './toastMessage';
import useTranslations from './translations';

const initialState = {
  email: '',
  password: '',
  givenName: '',
  invalidEmailError: null,
  showEmailInput: false,
  showPasswordInput: false,
  showCTA: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'updateEmail':
      return { ...state, email: action.data };
    case 'updatePassword':
      return { ...state, password: action.data };
    case 'updateName':
      return { ...state, givenName: action.data };
    case 'updateError':
      return { ...state, invalidEmailError: action.data };
    case 'updateShowEmailInput':
      return { ...state, showEmailInput: action.data };
    case 'updateShowPasswordInput':
      return { ...state, showPasswordInput: action.data };
    case 'updateShowCTA':
      return { ...state, showCTA: action.data };
    default:
      return state;
  }
}

export default function useEmailLogin({
  showErrorToasts,
  isSignUp,
  isValidEmail,
  isNameOptional,
  onSubmit,
  loginOnExistingUserSignUp,
  setShowDetails,
  isStepByStepSignup,
  isModalSignup,
  hide,
  userName,
  onExistingUserSignUpError,
  onError,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const Toast = useToastMessage();
  const { t } = useTranslations();
  const dispatchAuth = useDispatch();

  const {
    email,
    password,
    givenName,
    invalidEmailError,
    showEmailInput,
    showPasswordInput,
    showCTA,
  } = state;

  useEffect(() => {
    if (userName) {
      dispatch({ type: 'updateName', data: userName });
      dispatch({ type: 'updateShowEmailInput', data: true });
    }
  }, [userName]);

  const handleError = useCallback(
    (errorMessage, errorCode) => {
      if (showErrorToasts) {
        Toast.showError(errorMessage);
      }
      // Lets consumers render inline UI instead of toasts (V2 modal).
      if (typeof onError === 'function') {
        onError(errorMessage, errorCode);
      }
      dispatchAuth(setAuthLoading(false));
    },
    [Toast, showErrorToasts, onError]
  );
  const handleAuthError = useCallback(
    (error, isloginOnExistingUserSignUp = false) => {
      const errorCode = error.code;
      if (
        isloginOnExistingUserSignUp &&
        onExistingUserSignUpError &&
        typeof onExistingUserSignUpError === 'function'
      ) {
        onExistingUserSignUpError();
        return;
      }
      switch (errorCode) {
        case 'auth/wrong-password':
          handleError(
            t('email_login_form_toast_error_invalid_password'),
            errorCode
          );
          break;
        case 'auth/invalid-email':
        case 'auth/user-not-found':
          handleError(
            t('email_login_form_toast_error_no_account_found'),
            errorCode
          );
          break;
        case 'auth/user-disabled':
          handleError(
            t('email_login_form_toast_error_account_disabled'),
            errorCode
          );
          break;
        case 'auth/email-already-in-use':
          if (loginOnExistingUserSignUp) {
            Auth.signInWithEmailAndPassword(
              Auth.instance,
              email.trim(),
              password.trim()
            ).catch((err) => {
              handleAuthError(err, true);
            });
          } else {
            handleError(
              t('email_login_form_toast_error_email_in_use'),
              errorCode
            );
          }
          break;
        case 'auth/weak-password':
          handleError(
            t('email_login_form_toast_error_weak_password'),
            errorCode
          );
          break;
        default:
          handleError(
            t('email_login_form_toast_error_unknown_error'),
            errorCode
          );
          break;
      }
    },
    [email, handleError, loginOnExistingUserSignUp, password, t]
  );

  const handleUserEmailValidation = useCallback(async () => {
    if (isSignUp && isValidEmail(email)) {
      if (!isEmail(email)) {
        dispatch({ type: 'updateError', data: true });
      } else {
        dispatch({ type: 'updateError', data: false });
      }
    }
  }, [email, isSignUp, isValidEmail]);

  const onChangePassword = useCallback(
    (evt) => {
      if (
        isStepByStepSignup &&
        typeof setShowDetails === 'function' &&
        password.length > 6
      ) {
        setShowDetails(true);
        dispatch({ type: 'updateShowCTA', data: true });
      }
      dispatch({ type: 'updatePassword', data: evt.target.value });
    },
    [setShowDetails, isStepByStepSignup, password]
  );

  const onChangeEmail = useCallback(
    (evt) => {
      dispatch({ type: 'updateEmail', data: evt.target.value?.trim() });
      if (isValidEmail(evt.target.value?.trim())) {
        dispatch({ type: 'updateShowPasswordInput', data: true });
        if (typeof setShowDetails === 'function') {
          setShowDetails(true);
        }
      }
    },
    [isValidEmail, setShowDetails]
  );

  const onChangeName = useCallback((evt) => {
    dispatch({ type: 'updateName', data: evt.target.value });
    dispatch({ type: 'updateShowEmailInput', data: true });
  }, []);

  const handleSubmit = useCallback(
    async (evt) => {
      dispatchAuth(setAuthLoading(true));
      if (evt && evt.preventDefault) {
        evt.preventDefault();
      }
      if (
        isSignUp &&
        !isNameOptional &&
        (!givenName || givenName.trim() === '')
      ) {
        handleError(t('email_login_form_toast_error_enter_valid_name'));
        return;
      }
      if (typeof isValidEmail === 'function' && !isValidEmail(email)) {
        handleError(t('email_login_form_toast_error_enter_valid_email'));
        return;
      }
      if (!password || password === '') {
        handleError(t('email_login_form_toast_error_enter_password'));
        return;
      }
      if (isSignUp && password.length < 7) {
        handleError(t('email_login_form_toast_error_short_password'));
        return;
      }
      if (onSubmit) {
        onSubmit({
          email,
          password,
          givenName: givenName || null,
        });
      }
      if (isSignUp) {
        await Auth.createUserWithEmailAndPassword(
          Auth.instance,
          email.trim(),
          password.trim()
        )
          .then(() => {
            Analytics.authLogin();
            if (isModalSignup) {
              hide();
            }
          })
          .catch(handleAuthError)
          .finally(() => {
            dispatchAuth(setAuthLoading(false));
          });
      } else {
        Auth.signInWithEmailAndPassword(
          Auth.instance,
          email.trim(),
          password.trim()
        )
          .then(() => {
            Analytics.authLogin();
            if (isModalSignup) {
              hide();
            }
          })
          .catch(handleAuthError)
          .finally(() => {
            dispatchAuth(setAuthLoading(false));
          });
      }
    },
    [
      isSignUp,
      isNameOptional,
      givenName,
      isValidEmail,
      email,
      password,
      onSubmit,
      handleError,
      t,
      handleAuthError,
      isModalSignup,
      hide,
    ]
  );

  const handleForgotPassword = useCallback(async () => {
    if (!isValidEmail(email)) {
      handleError(t('email_login_form_toast_error_valid_email'));
      return;
    }
    const profile = await getUserFromEmail(email.toLowerCase());
    if (profile) {
      if (profile.provider !== `password`) {
        handleError(t('email_login_form_toast_error_try_relevant_option'));
      } else {
        try {
          await Auth.sendPasswordResetEmail(Auth.instance, email);
          Toast.showSuccess(t('email_login_form_toast_error_password_reset'));
        } catch (error) {
          handleError(error.message);
        }
      }
    } else {
      handleError(t('email_login_form_toast_error_no_user_found'));
    }
  }, [Toast, email, handleError, isValidEmail, t]);

  return {
    onChangeEmail,
    onChangeName,
    onChangePassword,
    handleSubmit,
    handleForgotPassword,
    email,
    givenName,
    handleUserEmailValidation,
    invalidEmailError,
    password,
    showEmailInput,
    showPasswordInput,
    showCTA,
  };
}
