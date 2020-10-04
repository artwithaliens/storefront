import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import introspectionResult from './fragment-types';

let apolloClient: ApolloClient<NormalizedCacheObject>;

const beforeware = onError(({ graphQLErrors }) => {
  graphQLErrors?.forEach(({ message }) => {
    if (message.match(/Expired token/)) {
      localStorage.removeItem('session');
    }
  });
});

const middleware = new ApolloLink((operation, forward) => {
  // If session data exist in local storage, set value as session header.
  const session = process.browser ? localStorage.getItem('session') : null;
  if (session != null) {
    operation.setContext(() => ({
      headers: {
        'woocommerce-session': `Session ${session}`,
      },
    }));
  }
  return forward(operation);
});

const afterware = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    // Check for session header and update session in local storage accordingly.
    const {
      response: { headers },
    } = operation.getContext();
    const session = headers.get('woocommerce-session');
    if (process.browser && session != null && localStorage.getItem('session') !== session) {
      localStorage.setItem('session', headers.get('woocommerce-session'));
    }
    return response;
  }),
);

export default function createClient({
  initialState = {},
}: { initialState?: NormalizedCacheObject } = {}) {
  if (apolloClient == null) {
    apolloClient = new ApolloClient({
      link: beforeware.concat(
        middleware.concat(
          afterware.concat(
            new HttpLink({
              uri: process.env.GRAPHQL_URL,
              credentials: 'include',
            }),
          ),
        ),
      ),
      cache: new InMemoryCache({ possibleTypes: introspectionResult.possibleTypes }).restore(
        initialState,
      ),
    });
  }
  return apolloClient;
}
