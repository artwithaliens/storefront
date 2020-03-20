import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { DefaultSeo } from 'next-seo';
import App from 'next/app';
import React from 'react';
import AppProvider from '../components/AppProvider';
import theme from '../theme';
import absoluteURL from '../utils/absoluteURL';

type Props = {
  err?: (Error & { statusCode?: number }) | null;
};

export default class extends App<Props> {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles != null) {
      jssStyles.remove();
    }
  }

  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <>
        <DefaultSeo
          title="Art With Aliens"
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: absoluteURL(router.asPath),
            site_name: 'Art With Aliens',
          }}
          twitter={{
            handle: '@artwithaliens',
            cardType: 'summary_large_image',
          }}
        />
        <AppProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </AppProvider>
      </>
    );
  }
}
