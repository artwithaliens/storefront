import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';
import { SettingsContext, SettingsProvider } from '@components/core/context';
import { ManagedUIContext } from '@components/ui/context';
import { CssBaseline } from '@material-ui/core';
import { NextComponentType } from 'next';
import { DefaultSeo } from 'next-seo';
import NextApp, { AppContext, AppInitialProps, AppProps as NextAppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import ReactGA from 'react-ga';
import { useMount } from 'react-use';
import createClient from '../apollo';
import absoluteURL from '../utils/absoluteURL';

type Props = NextAppProps & {
  apollo?: ApolloClient<NormalizedCacheObject>;
  apolloState?: {
    data?: NormalizedCacheObject;
  };
};

const App: NextComponentType<AppContext, AppInitialProps, Props> = ({
  apollo,
  apolloState,
  Component,
  pageProps,
  router,
}) => {
  useMount(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentNode?.removeChild(jssStyles);

    ReactGA.initialize(process.env.GA_TRACKING_ID, {
      debug: process.env.NODE_ENV === 'development',
    });
    ReactGA.plugin.require('ec');
    ReactGA.pageview(router.asPath);

    router.events.on('routeChangeComplete', (url: string) => {
      ReactGA.pageview(url);
    });
  });

  return (
    <ApolloProvider client={apollo ?? createClient({ initialState: apolloState?.data })}>
      <SettingsProvider>
        <SettingsContext.Consumer>
          {({ settings, seo }) => (
            <>
              <Head>
                <meta
                  name="viewport"
                  content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                />
                {seo.webmaster?.googleVerify != null && (
                  <meta name="google-site-verification" content={seo.webmaster.googleVerify} />
                )}
                {seo.webmaster?.msVerify != null && (
                  <meta name="msvalidate.01" content={seo.webmaster.msVerify} />
                )}
              </Head>
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
            </>
          )}
        </SettingsContext.Consumer>
        <ManagedUIContext>
          <CssBaseline />
          <Component {...pageProps} />
        </ManagedUIContext>
      </SettingsProvider>
    </ApolloProvider>
  );
};

App.getInitialProps = async (appContext) => {
  const { AppTree, ctx } = appContext;

  const apollo = createClient();
  const apolloState: Props['apolloState'] = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (ctx as any).apolloClient = apollo;
  const appProps = await NextApp.getInitialProps(appContext);

  if (!process.browser) {
    if (ctx.res && (ctx.res.headersSent || ctx.res.writableEnded)) {
      return appProps;
    }

    try {
      await getDataFromTree(<AppTree {...appProps} apollo={apollo} apolloState={apolloState} />);
    } catch (error) {
      // Prevent Apollo Client GraphQL errors from crashing SSR.
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('GraphQL error occurred [getDataFromTree]', error);
      }
    }

    // `getDataFromTree` does not call `componentWillUnmount`, therefore head
    // side effects need to be cleared manually.
    Head.rewind();

    apolloState.data = apollo.cache.extract();
  }

  // To avoid calling `createClient()` twice in the server, we send the Apollo
  // client as a prop to the component, otherwise the component would have to
  // call `createClient()` again, but this time without the context.
  // Once that happens, the following code will make sure we send the prop as
  // `null` to the browser.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (apollo as any).toJSON = () => null;

  return { ...appProps, apolloState, apollo };
};

export default App;
