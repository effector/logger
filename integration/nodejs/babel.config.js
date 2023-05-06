const config = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  plugins: [['effector/babel-plugin']],
};

module.exports = config;
