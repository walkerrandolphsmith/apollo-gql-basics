process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const chalk = require('chalk');
const fs = require('fs-extra');
const webpack = require('webpack');
const formatWebpackMessages = require('react-dev-utils-for-webpack4/formatWebpackMessages');

const config = require('../config/webpack.config.prod');
const paths = require('../config/paths');

fs.emptyDirSync(paths.dist);

copyAssets();

build(config)
  .then(response => {
    const stats = response.stats;
    const ellapseTime = stats.endTime - stats.startTime;
    console.log('Client build in', ellapseTime);
  })
  .catch(error => {
    console.log('Failed to build. Exiting with status 1', error);
    process.exit(1);
  });

function build(webpackConfig) {
  console.log('Creating an optimized production build...');

  let compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }
      const messages = formatWebpackMessages(stats.toJson({}, true));
      if (messages.errors.length) {
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }
      return resolve({
        stats,
        warnings: messages.warnings,
      });
    });
  });
}

function copyAssets() {
  fs.copySync(paths.static, paths.dist, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}
