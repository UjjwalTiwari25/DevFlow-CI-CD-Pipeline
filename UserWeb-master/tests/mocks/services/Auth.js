import Logger from './Logger';

async function getUserAuthToken() {
  Logger.info('FirebaseAuth.getUserAuthToken');
}

async function authSignOut() {
  Logger.info('FirebaseAuth.authSignOut');
}

async function createUserWithEmailAndPassword(email, password) {
  Logger.info('FirebaseAuth.createUserWithEmailAndPassword', email, password);
}

async function signInWithEmailAndPassword(email, password) {
  Logger.info('FirebaseAuth.signInWithEmailAndPassword', email, password);
}

async function signInWithPopup() {
  Logger.info('FirebaseAuth.signInWithPopup');
}

const Auth = {
  instance: {},
  getUserAuthToken,
  signOut: authSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
};

export default Auth;
