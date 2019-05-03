import express from 'express';
import fs from 'fs';
import path from 'path';
import render from './render';

const HOST = process.env.APP_HOST;
const PORT = process.env.APP_PORT;

const app = express();

if (process.env.NODE_ENV === 'development') {
  require('./devMiddleware')(app);
}

const assets = {
  js: ['/static/js/bundle.js'],
  css: '',
};

if (process.env.NODE_ENV === 'production') {
  const fileContents = fs.readFileSync(
    path.resolve('dist', 'asset-manifest.json')
  );
  const manifest = JSON.parse(fileContents);

  assets.js = [
    manifest['runtime~main.js'],
    manifest['vendors.js'],
    manifest['main.js'],
  ];

  assets.css = `<link rel="stylesheet" href="${manifest['main.css']}" />`;

  const resources = [
    'static',
    'manifest.json',
    'service-worker.js',
    'robots.txt',
  ];

  resources.forEach(resource =>
    app.use(`/${resource}`, express.static(path.resolve('./dist', resource)))
  );
}

app.use(render(assets));

const handleSuccess = () => {
  console.log(`🚀 Web Server is available on : http://${HOST}:${PORT}`);
};

app.listen({ port: PORT }, handleSuccess);
