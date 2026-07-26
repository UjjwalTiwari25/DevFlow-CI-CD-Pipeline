const NodeCache = require('node-cache');

let nodeCache = null;

// Lazily create the backing NodeCache on first use, and reuse it thereafter.
//
// This module is a singleton keyed by its module instance. In the Next.js
// custom-server setup the same source file is loaded through two different
// module registries: `server/index.js` (run directly by Node) requires it and
// calls `initialize()` at boot, while SSR code bundled by webpack (e.g.
// `/coaches` getServerSideProps -> `src/models/coach.js`) requires it via a
// relative path that webpack bundles as a *separate* copy. That bundled copy
// never had `initialize()` called on it, so it used to warn "Cache not
// initialized" and no-op — silently disabling the coaches-list SSR cache and
// reopening the /coaches OOM driver (PROD-3661 / PROD-3676).
//
// Making every accessor initialize on demand removes the ordering/instance
// dependency entirely: whichever module instance a caller gets works. This is
// idempotent — the NodeCache is constructed once per process (per module
// instance) and reused — so the explicit boot-time call is still harmless.
function initialize() {
  if (!nodeCache) {
    nodeCache = new NodeCache({
      stdTTL: process.env.CACHE_TTL
        ? parseInt(process.env.CACHE_TTL, 10)
        : 3600,
      checkperiod: process.env.CACHE_CHECK_PERIOD
        ? parseInt(process.env.CACHE_CHECK_PERIOD, 10)
        : 600,
      maxKeys: process.env.CACHE_MAX_KEYS
        ? parseInt(process.env.CACHE_MAX_KEYS, 10)
        : 1000,
      useClones: false, // Better performance when false
    });
  }
  return nodeCache;
}

const cacheService = {
  /**
   * Initialize the cache (idempotent). Called at boot; accessors also call it
   * on demand, so an explicit call is optional.
   * @returns {NodeCache} The initialized cache instance
   */
  initialize,

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any} Cached value or undefined if not found
   */
  get(key) {
    return initialize().get(key);
  },

  /**
   * Set a value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional)
   * @returns {boolean} Success status
   */
  set(key, value, ttl = 3600) {
    return initialize().set(key, value, ttl);
  },

  /**
   * Delete a value from cache
   * @param {string} key - Cache key
   * @returns {number} Number of deleted keys
   */
  del(key) {
    return initialize().del(key);
  },

  /**
   * Clear all cache
   */
  flush() {
    initialize().flushAll();
  },

  /**
   * Get cache statistics
   * @returns {Object} Cache stats
   */
  getStats() {
    return initialize().getStats();
  },

  /**
   * Check if a key exists in cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return initialize().has(key);
  },
};

module.exports = cacheService;
