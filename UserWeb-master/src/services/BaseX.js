// base-x v5 is published as an ESM-first package that exposes the factory as a
// default export (its CommonJS build sets `exports.default` with
// `__esModule: true`). Read `.default` so this keeps working both when bundled
// by Next/webpack and when executed by raw Node (e.g. scripts/redirects/*).
const baseX = require('base-x').default;

const BASE_36_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyz';
const base36 = baseX(BASE_36_CHARSET);

function to36(data) {
  return base36.encode(Uint8Array.from(data));
}

function from36(data) {
  return base36.decode(data).toString();
}

const BaseX = { to36, from36 };

module.exports = BaseX;
