const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const Package = require('./package.json');

module.exports = ['index', 'attach', 'inspector'].map((entry) => ({
  mode: 'production',
  entry: `./src/${entry}.ts`,
  output: {
    filename: `${entry}.js`,
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  externals: ['effector', 'forest', 'foliage', 'effector-inspector'].concat(
    Object.keys(Package.peerDependencies),
    Object.keys(Package.dependencies),
  ),
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
}));
