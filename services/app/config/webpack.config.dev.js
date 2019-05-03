const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils-for-webpack4/WatchMissingNodeModulesPlugin');
const paths = require('./paths');
const patterns = require('./patterns');
const commonConfig = require('./webpack.config.common.js');

const publicUrl = '';

const imageLoader = {
  test: patterns.image,
  loader: require.resolve('url-loader'),
  options: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]',
  },
};

const mjsCompatabilityHack = {
  test: /\.mjs$/,
  include: /node_modules/,
  type: 'javascript/auto',
};

const jsLoader = {
  test: patterns.clientJs,
  include: paths.appSrc,
  exclude: /node_modules/,
  use: ['babel-loader'],
};

const cssLoader = {
  test: patterns.css,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            flexbox: 'no-2009',
          }),
        ],
      },
    },
  ],
};

const htmlLoader = {
  exclude: patterns.staticExcludes,
  loader: require.resolve('file-loader'),
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
};

const clientConfig = {
  mode: 'development',
  name: 'client',
  target: 'web',
  devtool: 'cheap-module-source-map',
  entry: [
    'webpack-hot-middleware/client',
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ],
  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js',
    publicPath: paths.publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    // splitChunks: {
    //   chunks: 'all',
    //   name: 'vendors',
    // },
    // runtimeChunk: true,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          imageLoader,
          mjsCompatabilityHack,
          jsLoader,
          cssLoader,
          htmlLoader,
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(
      JSON.stringify({
        NODE_ENV: 'development',
        PUBLIC_URL: publicUrl,
      })
    ),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};

module.exports = Object.assign({}, commonConfig, clientConfig);
