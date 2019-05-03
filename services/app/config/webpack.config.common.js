const path = require('path');
const paths = require('./paths');
const ModuleScopePlugin = require('react-dev-utils-for-webpack4/ModuleScopePlugin');

module.exports = {
  target: 'web',
  resolve: {
    modules: ['node_modules', paths.appNodeModules],
    extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    plugins: [
      new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson, paths.config]),
    ],
  },
  performance: false,
};
