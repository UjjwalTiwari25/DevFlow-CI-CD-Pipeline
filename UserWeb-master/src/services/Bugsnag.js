import React from 'react';
import bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import config from '../config';

// Signatures that may appear in either err.errorMessage OR somewhere on the
// stack. The first batch (markAssetError, route-loader) only matches AFTER
// Bugsnag's server-side source-map resolution — i.e., in the dashboard, not
// in the browser onError hook. They're kept here as a belt-and-braces in
// case the SDK ever symbolicates client-side.
//
// The second batch — message-level signatures — are what actually fire in
// the browser at onError time, because the strings live in user-facing
// error messages and don't get minified. These catch the noise that
// PROD-1932's first pass missed.
const ASSET_ERROR_SIGNATURES = [
  // Symbolicated-only (kept for safety; usually won't match in browser):
  'markAssetError',
  'route-loader',
  // Message-level (these are what actually fire at onError time):
  'Loading chunk',
  'Loading CSS chunk',
  'ChunkLoadError',
  // The Next.js + core-js Symbol polyfill clash that produces the high-
  // volume fingerprint 69356c3c5d860bbd20c0166f on aura-userweb. Next's
  // markAssetError uses Symbol() as an Object.defineProperty key, which the
  // core-js polyfilled defineProperty refuses to coerce. The thrown
  // TypeError is just noise piled on top of the real chunk-load failure.
  'Cannot convert a Symbol value to a string',
];

// File-path patterns that survive minification and uniquely identify
// chunks where these errors originate. Matched against frame.file.
const ASSET_ERROR_FILE_PATTERNS = [
  '/_next/static/chunks/polyfills',
  '/_next/static/chunks/webpack',
];

function isAssetLoadError(event) {
  const err = event.errors && event.errors[0];
  if (!err) return false;
  const message = err.errorMessage || '';
  const stack = err.stacktrace || [];
  const stackBlob = stack
    .map((frame) => `${frame.file || ''} ${frame.method || ''}`)
    .join('\n');
  if (
    ASSET_ERROR_SIGNATURES.some(
      (sig) => message.includes(sig) || stackBlob.includes(sig)
    )
  ) {
    return true;
  }
  // Fallback: a TypeError whose stack passes through the polyfills bundle
  // is almost certainly the Symbol-vs-defineProperty clash described above,
  // even when the error message has been further wrapped/translated.
  const errClass = err.errorClass || '';
  if (errClass === 'TypeError') {
    return stack.some((frame) =>
      ASSET_ERROR_FILE_PATTERNS.some((pattern) =>
        (frame.file || '').includes(pattern)
      )
    );
  }
  return false;
}

const options = config.bugsnag;
const configuration = {
  ...options,
  plugins: [new BugsnagPluginReact()],
  onError(event) {
    if (isAssetLoadError(event)) {
      return false;
    }
    return true;
  },
};
const Bugsnag = bugsnag.start(configuration);

export const ErrorBoundary =
  Bugsnag.getPlugin('react').createErrorBoundary(React);

export default Bugsnag;
