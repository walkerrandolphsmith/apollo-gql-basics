import 'ignore-styles';
import nodeFetch from 'node-fetch';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import App from 'src/shared/components/App';
import getApiAddress from 'src/shared/utils/getApiAddress';

export default (assets = {}) => {
  const apiConfig = {
    apiHost: 'localhost',
    apiPort: null,
    apiIsHttps: true,
  };

  const clientApiConifg = {
    apiHost: 'localhost',
    apiPort: null,
    apiIsHttps: true,
  };

  const { httpUri, wsUri } = getApiAddress(apiConfig);

  return (req, res, next) => {
    const { url, path } = req;

    const client = new ApolloClient({
      ssrMode: true,
      link: createHttpLink({
        uri: httpUri,
        credentials: 'same-origin',
        headers: {
          cookie: req.header('Cookie'),
        },
        fetch: nodeFetch,
      }),
      cache: new InMemoryCache(),
    });

    const ServerApp = () => (
      <ApolloProvider client={client}>
        <StaticRouter location={url} context={{}}>
          <App />
        </StaticRouter>
      </ApolloProvider>
    );

    getDataFromTree(ServerApp)
      .then(() => {
        const initialData = client.extract();

        const markup = renderToString(<ServerApp />);

        const helmet = Helmet.renderStatic();

        const scripts = assets.js
          .map(src => `<script type="text/javascript" src="${src}"></script>`)
          .join('');

        const html = `<!doctype html>
          <html lang="en" dir="ltr">
          <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              <link rel="manifest" href="/manifest.json">
              ${assets.css}
          </head>
          <body ${helmet.bodyAttributes.toString()}>
              <noscript>You need to enable JavaScript to run this app.</noscript>
              <div id="root">${markup}</div>
              <script>window.__INITIAL_DATA__ = ${JSON.stringify(initialData)};
              window.__API_CONFIG__ = ${JSON.stringify(clientApiConifg)};
              </script>
              ${scripts}
          </body>
          </html>
        `;

        res.status(200).send(html.replace(/^\s+|\s+$/g, ''));
      })
      .catch(next);
  };
};
