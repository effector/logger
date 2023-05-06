const { resolve: resolvePath } = require('path');

module.exports = (api) => {
  api && api.cache && api.cache.never && api.cache.never();
  // const env = api.cache(() => process.env.NODE_ENV)
  return generateConfig(meta, babelConfig);
};

const meta = {
  isEsm: true,
};

function generateConfig(meta, config = babelConfig) {
  const result = {};
  for (const key in config) {
    const value = config[key];
    result[key] = typeof value === 'function' ? value(meta) : value;
  }
  return result;
}

module.exports.generateConfig = generateConfig;

const aliases = {};

const babelConfig = {
  plugins(meta) {
    const alias = parseAliases(meta, aliases);
    const result = [
      ['effector/babel-plugin', { addLoc: true }],
      [
        'babel-plugin-module-resolver',
        {
          alias,
          loglevel: 'silent',
        },
      ],
    ];

    return result;
  },
};

function parseAliases(meta, obj) {
  const result = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value === 'function') {
      const name = value(meta);
      if (name === undefined || name === null) continue;
      result[key] = name;
    } else if (typeof value === 'object' && value !== null) {
      const name = applyPaths(value);
      if (name === undefined || name === null) continue;
      result[key] = name;
    } else {
      const name = value;
      if (name === undefined || name === null) continue;
      result[key] = name;
    }
  }
  return result;

  function applyPaths(paths) {
    if (meta.isEsm) return paths.esm;
    return paths.default;
  }
}

module.exports.getAliases = (metadata = meta) => parseAliases(metadata, aliases);
