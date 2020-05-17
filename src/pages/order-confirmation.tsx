import { Box, Container, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';
import Layout from '../components/Layout';

const OrderConfirmation: NextPage = () => (
  <Layout>
    <Container>
      <Box textAlign="center">
        <Typography gutterBottom variant="h1">
          Thank you for your order!
        </Typography>
        <Typography gutterBottom>
          We’ve emailed you an order confirmation.
          <br />
          We’ll notify you when the order has been shipped.
        </Typography>
        <Button href="/shop">Continue shopping</Button>{' '}
        <Button href="/order-history/[orderId]" as="/order-history/1234">
          Order details
        </Button>
      </Box>
    </Container>
  </Layout>
);

export default OrderConfirmation;
