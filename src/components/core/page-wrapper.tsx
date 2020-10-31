import { AlertProvider, CookieBanner, Footer, Header } from '@components/core';
import { Box } from '@material-ui/core';
import React from 'react';

const PageWrapper: React.FC = ({ children }) => (
  <AlertProvider>
    <Header />
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Box>
    <Footer />
    <CookieBanner />
  </AlertProvider>
);

export default PageWrapper;
