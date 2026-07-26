jest.mock('../../src/services/Analytics', () =>
  require('../mocks/services/Analytics')
);
jest.mock('../../src/services/FirebaseApp', () =>
  require('../mocks/services/FirebaseApp')
);
jest.mock('../../src/services/FirebaseDatabase', () =>
  require('../mocks/services/FirebaseDatabase')
);
jest.mock('../../src/services/Auth', () => require('../mocks/services/Auth'));
jest.mock('../../src/services/Bugsnag', () =>
  require('../mocks/services/Bugsnag')
);
jest.mock('../../src/services/Logger', () =>
  require('../mocks/services/Logger')
);
