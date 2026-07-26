import loadClarity from './scripts/clarity';
import config from '../config';

const options = config.clarity;

function initAndTrack() {
  if (options.id) {
    loadClarity(options);
  }
}

const Clarity = {
  initAndTrack,
};

export default Clarity;
