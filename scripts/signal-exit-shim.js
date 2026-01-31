// Ensure packages expecting signal-exit's legacy default export keep working.
// Newer signal-exit versions expose named exports; older consumers expect a function.
const mod = require('signal-exit');
const onExit = typeof mod === 'function' ? mod : mod?.onExit;

if (typeof onExit !== 'function') {
  throw new Error('signal-exit shim: unable to resolve onExit function');
}

// Override module export so future requires get the compatible function.
const resolved = require.resolve('signal-exit');
require.cache[resolved] = {
  id: resolved,
  filename: resolved,
  loaded: true,
  exports: onExit,
};

// Force any subsequent resolutions of 'signal-exit' to point at the legacy path.
const Module = require('module');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request === 'signal-exit') {
    return resolved;
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

if (process.env.DEBUG_SIGNAL_EXIT_SHIM === '1') {
  // eslint-disable-next-line no-console
  console.log('[signal-exit-shim] installed legacy onExit export from', resolved);
}

module.exports = onExit;
