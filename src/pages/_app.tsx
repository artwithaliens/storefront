import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCache,
} from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import withApollo, { WithApolloProps } from '@sotnikov/next-with-apollo';
import { register, unregister } from 'next-offline/runtime';
import { DefaultSeo } from 'next-seo';
import App from 'next/app';
import Head from 'next/head';
import React from 'react';
import ReactGA from 'react-ga';
import AlertProvider from '../components/global/alert-provider';
import SettingsProvider, { SettingsContext } from '../components/global/settings-provider';
import introspectionResult from '../fragment-types';
import theme from '../theme';
import absoluteURL from '../utils/absolute-url';

export const middleware = new ApolloLink((operation, forward) => {
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

export const afterware = new ApolloLink((operation, forward) =>
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

export default withApollo(
  ({ initialState }) =>
    // Apollo GraphQL client.
    new ApolloClient({
      link: middleware.concat(
        afterware.concat(
          new HttpLink({
            uri: process.env.GRAPHQL_URL,
            credentials: 'include',
          }),
        ),
      ),
      cache: new InMemoryCache({ possibleTypes: introspectionResult.possibleTypes }).restore(
        initialState || {},
      ),
    }),
)(
  class extends App<WithApolloProps<NormalizedCache>> {
    componentDidMount() {
      const { router } = this.props;

      // Remove the server-side injected CSS.
      const jssStyles = document.querySelector('#jss-server-side');
      if (jssStyles?.parentNode != null) {
        jssStyles.parentNode.removeChild(jssStyles);
      }

      if (process.env.NODE_ENV === 'production') {
        register();
      }

      ReactGA.initialize(process.env.GA_TRACKING_ID, {
        debug: process.env.NODE_ENV === 'development',
      });
      ReactGA.plugin.require('ec');
      ReactGA.pageview(router.asPath);

      router.events.on('routeChangeComplete', (url: string) => {
        ReactGA.pageview(url);
      });
    }

    componentWillUnmount() {
      if (process.env.NODE_ENV === 'production') {
        unregister();
      }
    }

    render() {
      const { apollo, Component, pageProps, router } = this.props;

      return (
        <>
          <Head>
            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
            />
          </Head>
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
        </>
      );
    }
  },
  { getDataFromTree },
);
