import { Box } from '@material-ui/core';
import React from 'react';
import CookieBanner from './cookie-banner';
import Footer from './footer';
import Header from './header';

const PageWrapper: React.FC = ({ children }) => (
  <>
    <Header />
    <Box display="flex" flexDirection="column">
      {children}
    </Box>
    <Footer />
    <CookieBanner />
  </>
);

export default PageWrapper;
