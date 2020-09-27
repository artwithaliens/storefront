import { Box } from '@material-ui/core';
import React from 'react';
import AlertProvider from './alert-provider';
import CookieBanner from './cookie-banner';
import Footer from './footer';
import Header from './header';

const PageWrapper: React.FC = ({ children }) => (
  <AlertProvider>
    <Header />
    <Box display="flex" flexDirection="column">
      {children}
    </Box>
    <Footer />
    <CookieBanner />
  </AlertProvider>
);

export default PageWrapper;
