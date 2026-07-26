import {
  ref,
  get,
  child,
  onValue,
  off,
  set,
  update,
  push,
} from 'firebase/database';
import { notifyHandledError } from './ErrorMonitoring';
import FirebaseApp from './FirebaseApp';

const { Database } = FirebaseApp;

async function getValue(path, iteration = 0) {
  try {
    if (!path) return null;
    const snapshot = await get(child(ref(Database), path));
    const value = snapshot.val();
    return value;
  } catch (error) {
    if (
      typeof error?.message === 'string' &&
      error.message.toLowerCase().includes('client is offline')
    ) {
      notifyHandledError(
        new Error('Firebase fetch failed with client offline error'),
        {
          message: error.message,
          path,
          iteration,
        }
      );
      return null;
    }
    notifyHandledError(error, {
      message: 'Failed to get value from Firebase',
      path,
      iteration,
    });
    return null;
  }
}

async function getSnapshot(path) {
  try {
    if (!path) return null;
    const snapshot = await get(child(ref(Database), path));

    return snapshot;
  } catch (error) {
    notifyHandledError(error, {
      message: 'Error getting snapshot from Firebase',
      path,
    });
    return null;
  }
}
function getRef(path) {
  if (!path) return null;
  return ref(Database, path);
}

async function setValue(path, value) {
  try {
    if (!path) return null;
    const response = await set(ref(Database, path), value);
    return response;
  } catch (error) {
    notifyHandledError(error, {
      message: 'Error setting value in Firebase',
      path,
      value,
    });
    return { error: true };
  }
}

async function updateValue(path, value) {
  try {
    if (!path) return null;
    const response = await update(ref(Database, path), value);
    return response;
  } catch (error) {
    notifyHandledError(error, {
      message: 'Error updating value in Firebase',
      path,
      value,
    });
    return null;
  }
}

async function generateId(path) {
  try {
    if (!path) return null;
    const res = await push(child(ref(Database), path));
    return res && res.key;
  } catch (error) {
    notifyHandledError(error, {
      message: 'Error generating push id in Firebase',
      path,
    });
    return null;
  }
}

const FirebaseDatabase = {
  getValue,
  getSnapshot,
  getRef,
  onValue,
  off,
  setValue,
  updateValue,
  generateId,
};

export default FirebaseDatabase;
