import Logger from './Logger';
import config from '../config';
import loadBranch from './scripts/branch';

function init() {
  Logger.debug('Creating Branch instance');
  loadBranch();
  branch.init(config.branch.branchKey, (error) => {
    if (error) {
      Logger.error('Failed to initialize branch', { error });
    }
  });
}

const Branch = {
  init,
  instance: () => {
    if (typeof branch === 'undefined') {
      init();
    }
    return branch;
  },
};

export default Branch;
