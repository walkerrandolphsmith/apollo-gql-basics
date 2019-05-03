const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils-for-webpack4/getCSSModuleLocalIdent');

const paths = require('./paths');
const patterns = require('./patterns');
const commonConfig = require('./webpack.config.common.js');

const publicPath = paths.servedPath;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          autoprefixer({
            flexbox: 'no-2009',
          }),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap,
      },
    });
  }
  return loaders;
};

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
  use: [
    {
      loader: require.resolve('babel-loader'),
      options: {
        compact: true,
        highlightCode: true,
      },
    },
  ],
};

const htmlLoader = {
  loader: require.resolve('file-loader'),
  exclude: patterns.staticExcludes,
  options: {
    name: 'static/media/[name].[hash:8].[ext]',
  },
};

const uglifyJsPlugin = new UglifyJsPlugin({
  uglifyOptions: {
    parse: {
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      comparisons: false,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true,
    },
  },
  parallel: true,
  cache: true,
  sourceMap: shouldUseSourceMap,
});

const clientConfig = {
  mode: 'production',
  name: 'client',
  target: 'web',
  bail: true,
  devtool: shouldUseSourceMap ? 'source-map' : false,
  entry: [require.resolve('./polyfills'), paths.appIndexJs],
  output: {
    path: paths.dist,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path
        .relative(paths.appSrc, info.absoluteResourcePath)
        .replace(/\\/g, '/'),
  },
  optimization: {
    minimizer: [uglifyJsPlugin, new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: true,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          imageLoader,
          mjsCompatabilityHack,
          jsLoader,
          {
            test: patterns.css,
            exclude: patterns.cssModule,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
            }),
          },
          {
            test: patterns.cssModule,
            loader: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap,
              modules: true,
              getLocalIdent: getCSSModuleLocalIdent,
            }),
          },
          htmlLoader,
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin(
      JSON.stringify({
        NODE_ENV: 'production',
        PUBLIC_URL: publicUrl,
      })
    ),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          return;
        }
        console.log(message);
      },
      minify: true,
      navigateFallback: publicUrl + '/index.html',
      navigateFallbackWhitelist: [/^(?!\/__).*/],
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
};

const serverConfig = {
  mode: 'production',
  name: 'server',
  target: 'node',
  externals: [nodeExternals()],
  entry: paths.serverEntry,
  output: {
    path: paths.dist,
    filename: 'server/index.js',
    publicPath: publicPath,
  },
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.js'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          mjsCompatabilityHack,
          jsLoader,
          { test: patterns.css, loader: 'ignore-loader' },
          { test: patterns.cssModules, loader: 'ignore-loader' },
          { test: patterns.image, loader: 'ignore-loader' },
          { test: patterns.staticExcludes, loader: 'ignore-loader' },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [uglifyJsPlugin],
  },
  plugins: [
    new webpack.DefinePlugin(
      JSON.stringify({
        NODE_ENV: 'production',
        PUBLIC_URL: publicUrl,
      })
    ),
  ],
};

module.exports = [Object.assign({}, commonConfig, clientConfig), serverConfig];
