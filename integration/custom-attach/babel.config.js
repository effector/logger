const config = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [["effector/babel-plugin", {addLoc: true, addNames: true}]]
};

module.exports = config;
