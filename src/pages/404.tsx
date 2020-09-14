import { Divider, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/global/layout';

const Custom404: NextPage = () => (
  <Layout>
    <Typography variant="h1">404</Typography>
    <Divider />
    <div>
      <Typography gutterBottom>We can’t seem to find a page you are looking for!</Typography>
      <Typography gutterBottom>
        You may have mistyped the address or the page may have moved.
      </Typography>
      <Typography gutterBottom>
        We’re sorry for the error and hope you’ll have a good day.
      </Typography>
    </div>
  </Layout>
);

export default Custom404;
