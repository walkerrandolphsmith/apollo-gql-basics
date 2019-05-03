module.exports = app => {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('./../../config/webpack.config.dev');

  const compiler = webpack(config);

  let bundleStart = null;

  compiler.plugin('compile', () => {
    console.info(`==> 💻  Webpack Dev Middleware bundling...`);
    bundleStart = Date.now();
  });

  compiler.plugin('done', () => {
    console.log(`Bundled in ${Date.now() - bundleStart} ms!`);
  });

  const bundler = webpackDevMiddleware(compiler, {
    serverSideRender: true,
    hot: true,
    publicPath: config.output.publicPath,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, Content-Type, Authorization',
    },
  });

  app.use(bundler);

  const clientCompiler = compiler;

  app.use(hotMiddleware(clientCompiler));
};
