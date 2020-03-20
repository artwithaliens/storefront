import { Box, Typography } from '@material-ui/core';
import React from 'react';
import Button from '../Button';

const EmptyCart: React.FC = () => (
  <Box textAlign="center">
    <Typography gutterBottom variant="h4">
      Your cart is empty
    </Typography>
    <Typography gutterBottom>
      You haven’t added anything to your cart. I’m sure you’ll find something in our shop.
    </Typography>
    <Button href="/shop" color="primary">
      Continue shopping
    </Button>
  </Box>
);

export default EmptyCart;
