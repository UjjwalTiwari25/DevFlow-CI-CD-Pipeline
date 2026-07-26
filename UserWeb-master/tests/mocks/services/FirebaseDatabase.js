import Logger from './Logger';

async function getValue(path, iteration = 0) {
  Logger.info('FirebaseDatabase.getValue', path, iteration);
}

async function getSnapshot(path) {
  Logger.info('FirebaseDatabase.getSnapshot', path);
}
function getRef(path) {
  Logger.info('FirebaseDatabase.getRef', path);
}

async function setValue(path, value) {
  Logger.info('FirebaseDatabase.setValue', path, value);
}

async function updateValue(path, value) {
  Logger.info('FirebaseDatabase.updateValue', path, value);
}

async function generateId(path) {
  Logger.info('FirebaseDatabase.generateId', path);
}

async function onValue(path, callback) {
  Logger.info('FirebaseDatabase.onValue', path, callback);
}

async function off(path, callback) {
  Logger.info('FirebaseDatabase.off', path, callback);
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
