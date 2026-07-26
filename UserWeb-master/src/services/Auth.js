import {
  OAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithCredential,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import Logger from './Logger';
import FirebaseApp from './FirebaseApp';
import { notifyHandledError } from './ErrorMonitoring';

const { Auth: FirebaseAuth } = FirebaseApp;
const GoogleProvider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();
const AppleProvider = new OAuthProvider('apple.com');

async function getUserAuthToken() {
  const user = FirebaseAuth.currentUser;
  let token = null;
  if (user) {
    token = await user.getIdToken();
    if (!token) {
      notifyHandledError(null, {
        message: 'Failed to get auth token for logged in user',
        authUserId: user.uid,
        authReady: await FirebaseAuth.authStateReady(),
      });
    }
  }
  return token;
}

function getCurrentUser() {
  return FirebaseAuth.currentUser;
}

async function authSignOut() {
  Logger.info('auth: signout');
  try {
    await signOut(FirebaseAuth);
  } catch (error) {
    Logger.error(error);
  }
}

const Auth = {
  instance: FirebaseAuth,
  AppleProvider,
  GoogleProvider,
  FacebookProvider,
  getCurrentUser,
  getUserAuthToken,
  signOut: authSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  signInWithCredential,
  browserPopupRedirectResolver,
};

export default Auth;
