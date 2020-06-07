import ApolloClient, { InMemoryCache, NormalizedCacheObject } from 'apollo-boost';

const client = new ApolloClient<NormalizedCacheObject>({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://payments.braintree-api.com/graphql'
      : 'https://payments.sandbox.braintree-api.com/graphql',
  credentials: 'include',
  headers: {
    authorization: `Bearer ${process.env.BRAINTREE_API_KEY}`,
    'braintree-version': '2020-05-07',
    'content-type': 'application/json',
  },
  cache: new InMemoryCache(),
});

export default client;
