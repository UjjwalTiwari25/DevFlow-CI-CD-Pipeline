// Each test needs a pristine module because the backing NodeCache is held in
// module-level state; resetModules() gives every test its own uninitialized
// singleton.
describe('Cache service', () => {
  let warnSpy;

  beforeEach(() => {
    jest.resetModules();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  // Regression test for PROD-3676: the webpack-bundled copy of this module (used
  // by /coaches getServerSideProps) never had initialize() called on it, so
  // get/set no-op'd and the coaches-list SSR cache silently disabled itself.
  // Accessing the cache before initialize() must now transparently work.
  it('set/get work without an explicit initialize() call', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');

    expect(cache.set('coachesList:firebase:en', ['a', 'b'])).toBe(true);
    expect(cache.get('coachesList:firebase:en')).toEqual(['a', 'b']);
  });

  it('does not warn "Cache not initialized" on first access', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');

    cache.get('coachesList:firebase:en');
    cache.set('coachesList:firebase:en', ['a']);

    const warnedNotInitialized = warnSpy.mock.calls.some(([arg]) =>
      JSON.stringify(arg || '').includes('Cache not initialized')
    );
    expect(warnedNotInitialized).toBe(false);
  });

  it('get returns undefined for a missing key', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');

    expect(cache.get('missing')).toBeUndefined();
    expect(cache.has('missing')).toBe(false);
  });

  it('initialize() is idempotent and preserves existing entries', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');

    const first = cache.initialize();
    cache.set('key', 'value');
    const second = cache.initialize();

    expect(second).toBe(first);
    expect(cache.get('key')).toBe('value');
  });

  // The cache runs with useClones:false, so callers get back the exact stored
  // reference (coach.js relies on this — its comment documents the immutability
  // contract). Guard against an accidental useClones flip.
  it('returns the same object reference that was stored (useClones:false)', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');
    const stored = [{ id: 1 }];

    cache.set('coachesList:firebase:en', stored);

    expect(cache.get('coachesList:firebase:en')).toBe(stored);
  });

  it('flush() clears all entries', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');
    cache.set('a', 1);
    cache.set('b', 2);

    cache.flush();

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });

  it('lazy access after set produces a working, shared instance', () => {
    // eslint-disable-next-line global-require
    const cache = require('./Cache');

    // First access lazily initializes; a later initialize() must not wipe it.
    cache.set('key', 'value');
    cache.initialize();

    expect(cache.get('key')).toBe('value');
    expect(cache.del('key')).toBe(1);
    expect(cache.has('key')).toBe(false);
  });
});
