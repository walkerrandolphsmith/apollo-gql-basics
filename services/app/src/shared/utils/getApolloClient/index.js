import { ApolloClient } from 'apollo-client';
import { split, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { withClientState } from 'apollo-link-state';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { createUploadLink } from 'apollo-upload-client';
import noop from 'lodash.noop';

import getApiAddress from 'src/shared/utils/getApiAddress';

export default (apiConfig = {}, errorReporter = noop) => {
  const { httpUri, wsUri } = getApiAddress(apiConfig);

  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        user: (_, { id }, { getCacheKey }) =>
          getCacheKey({ __typename: 'User', id }),
      },
    },
  });

  const request = async operation => {
    const token = localStorage.getItem('JWT');
    const headers = {};
    if (token) headers['x-token'] = token;
    console.log('sending jwt', token);
    operation.setContext({
      headers,
    });
  };

  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable(observer => {
        let handle;
        Promise.resolve(operation)
          .then(oper => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  const localStateLink = withClientState({
    defaults: {
      isConnected: true,
    },
    resolvers: {
      Mutation: {
        updateNetworkStatus: (_, { isConnected }, { cache }) => {
          cache.writeData({ data: { isConnected } });
          return null;
        },
      },
    },
    cache,
  });

  const wsLink = new WebSocketLink({
    uri: wsUri,
    options: {
      reconnect: true,
      connectionParams: {
        // authToken: token,
      },
    },
  });

  const fileUploadLink = createUploadLink({
    uri: httpUri,
    fetchOptions: 'same-origin',
  });

  const networkTrafficLink = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    fileUploadLink
  );

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) errorReporter(graphQLErrors);
    if (networkError) {
      // TODO: logout ?
      errorReporter(networkError);
    }
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      localStateLink,
      requestLink,
      networkTrafficLink,
    ]),
    cache,
  });

  return client;
};
