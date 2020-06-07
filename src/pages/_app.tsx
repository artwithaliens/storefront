import { ApolloProvider } from '@apollo/react-hooks';
import { getDataFromTree } from '@apollo/react-ssr';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import ApolloClient, {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  NormalizedCache,
} from 'apollo-boost';
import { register, unregister } from 'next-offline/runtime';
import { DefaultSeo } from 'next-seo';
import withApollo, { WithApolloProps } from 'next-with-apollo';
import App from 'next/app';
import React from 'react';
import AlertProvider from '../components/AlertProvider';
import SettingsProvider, { SettingsContext } from '../components/SettingsProvider';
import introspectionQueryResultData from '../fragmentTypes';
import theme from '../theme';
import absoluteURL from '../utils/absoluteURL';

// Fragment matcher.
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export default withApollo(
  ({ initialState }) =>
    // Apollo GraphQL client.
    new ApolloClient({
      uri: process.env.GRAPHQL_URL,
      credentials: 'include',
      cache: new InMemoryCache({ fragmentMatcher }).restore(initialState || {}),
    }),
)(
  class extends App<WithApolloProps<NormalizedCache>> {
    componentDidMount() {
      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles != null) {
        jssStyles.remove();
      }
      if (process.env.NODE_ENV === 'production') {
        register();
      }
    }

    componentWillUnmount() {
      if (process.env.NODE_ENV === 'production') {
        unregister();
      }
    }

    render() {
      const { apollo, Component, pageProps, router } = this.props;

      return (
        <ApolloProvider client={apollo}>
          <SettingsProvider>
            <SettingsContext.Consumer>
              {(settings) => (
                <DefaultSeo
                  title={settings.title ?? undefined}
                  description={settings.description ?? undefined}
                  canonical={absoluteURL(router.asPath)}
                  openGraph={{
                    type: 'website',
                    locale: 'en_US',
                    url: absoluteURL(router.asPath),
                    site_name: settings.title ?? undefined,
                  }}
                  twitter={{
                    handle: '@artwithaliens',
                    cardType: 'summary_large_image',
                  }}
                />
              )}
            </SettingsContext.Consumer>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AlertProvider>
                <Component {...pageProps} />
              </AlertProvider>
            </ThemeProvider>
          </SettingsProvider>
        </ApolloProvider>
      );
    }
  },
  { getDataFromTree },
);
