export const buildRestEndpoint = (namespace, base) => {
  if (!namespace || !base) {
    return '';
  }

  let endpoint = `${namespace}/${base}`;
  if (!endpoint.startsWith('/')) {
    endpoint = `/${endpoint}`;
  }

  return endpoint;
}
