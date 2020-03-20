import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-boost';
import withApollo from 'next-with-apollo';
import React from 'react';
import introspectionQueryResultData from './fragmentTypes';

// Fragment matcher.
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export default withApollo(
  ({ initialState }) => {
    // Apollo GraphQL client.
    return new ApolloClient({
      uri: process.env.GRAPHQL_URL,
      credentials: 'include',
      cache: new InMemoryCache({ fragmentMatcher }).restore(initialState || {}),
    });
  },
  {
    render: ({ Page, props }) => (
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      <ApolloProvider client={props.apollo}>
        <Page {...props} />
      </ApolloProvider>
    ),
  },
);
