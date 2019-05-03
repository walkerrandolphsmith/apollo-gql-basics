import 'cross-fetch/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import ErrorBoundary from 'src/shared/components/ErrorBoundary';
import getApolloClient from 'src/shared/utils/getApolloClient';
import registerServiceWorker from 'src/client/registerServiceWorker';

let App = require('src/shared/components/App').default;

const apiConfig = window.__API_CONFIG__;

const client = getApolloClient(apiConfig);

const render = App => {
  ReactDOM.hydrate(
    // <ErrorBoundary>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>,
    // </ErrorBoundary>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./../shared/components/App', () => {
    App = require('./../shared/components/App').default;

    render(App);
  });
}

registerServiceWorker();
