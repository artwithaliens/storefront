import { Box, Container, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Button from '../components/global/button';
import PageWrapper from '../components/global/page-wrapper';

const OrderConfirmation: NextPage = () => (
  <PageWrapper>
    <Container>
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography gutterBottom variant="h1">
          Thank you for your order!
        </Typography>
        <Typography gutterBottom>
          I’ve emailed you an order confirmation.
          <br />
          I’ll notify you when the order has been shipped.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button color="secondary" href="/shop">
            Continue shopping
          </Button>
        </Box>
      </Box>
    </Container>
  </PageWrapper>
);

export default OrderConfirmation;
