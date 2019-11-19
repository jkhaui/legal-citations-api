const nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [nodeExternals()],
  optimization: {
    minimize: true
  },
  plugins: [
    // After bundling the package, we must ensure `schema.graphql` is
    // included in the root, otherwise `fs` will throw an error.
    new CopyWebpackPlugin([
      'schema.graphql'
    ])
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: __dirname,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        include: __dirname,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  }
};