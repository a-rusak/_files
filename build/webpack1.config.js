'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
};
const PROD = process.env.NODE_ENV === 'production';

module.exports = {
  debug: true,
  devtool: PROD ? 'source-map' : 'cheap-source-map',
  noInfo: false,
  entry: PROD ?
    [
      'babel-polyfill',
      './src/index'
    ] : [
      'webpack-hot-middleware/client?reload=true', // reloads the page if hot module reloading fails.
      'babel-polyfill',
      './src/index'
    ],
  target: 'web',

  output: {
    path: PROD ? __dirname + '/build' : __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  resolve: {
    root: [path.resolve('./src')],
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: PROD ? './build' : './src'
  },
  plugins: PROD ? [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin('bundle.css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ] : [
      new webpack.HotModuleReplacementPlugin(),
      //new ExtractTextPlugin('bundle.css'),
      new webpack.NoErrorsPlugin()
    ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        exclude: [/node_modules/]
      },
      /*{
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
        //loader: 'style-loader!css-loader!postcss-loader'
      },*/
      {
        test: /\.less$/,
        loader: PROD ?
          ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader!less-loader?sourceMap') :
          'style-loader!css-loader?sourceMap!postcss-loader!less-loader?sourceMap'
      },
      { test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
      { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.svg/, loader: 'url-loader?limit=26000&mimetype=image/svg+xml&name=[path][name].[ext]' },
      { test: /\.(woff|woff2|ttf|eot)/, loader: 'url-loader?limit=1&name=[path][name].[ext]' },
      //{ test: /\.jsx?$/, loader: 'babel', exclude: [/node_modules/, /public/] },
      //{ test: /\.json$/, loader: 'json-loader' }
    ]
  }
};
