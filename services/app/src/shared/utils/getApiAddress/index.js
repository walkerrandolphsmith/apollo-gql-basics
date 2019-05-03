export default ({ apiHost = 'localhost', apiPort = '', apiIsHttps }) => {
  const isSecure = apiIsHttps ? 's' : '';
  const port = Boolean(apiPort) ? `:${apiPort}` : '';
  const httpUri = `http${isSecure}://${apiHost}${port}/graphql/`;
  const wsUri = `ws${isSecure}://${apiHost}${port}/graphql/`;

  return {
    httpUri,
    wsUri,
  };
};
