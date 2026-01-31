const resolved = require.resolve('signal-exit');
const mod = require(resolved);
const onExit = typeof mod === 'function' ? mod : mod?.onExit;

if (typeof onExit !== 'function') {
  throw new Error(
    `signal-exit shim: expected function, got ${typeof onExit} from ${resolved}`
  );
}

require.cache[resolved] = {
  id: resolved,
  filename: resolved,
  loaded: true,
  exports: onExit,
};

module.exports = onExit;
