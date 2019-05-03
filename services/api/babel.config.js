const path = require('path');

module.exports = function(api) {
  api.cache(true);

  var env = {
    test: {
      plugins: ['rewire'],
    },
  };

  var presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ];

  var plugins = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-json-strings',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-transform-async-to-generator',
    [
      'module-resolver',
      {
        cwd: 'packagejson',
        root: ['./'],
        alias: {
          src: './src',
        },
      },
    ],
  ];

  return {
    env: env,
    presets: presets,
    plugins: plugins,
  };
};
