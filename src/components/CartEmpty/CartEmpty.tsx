import { Box, Typography } from '@material-ui/core';
import React from 'react';
import Button from '../Button';

const CartEmpty: React.FC = () => (
  <Box my={4} textAlign="center">
    <Box mb={2}>
      <Typography gutterBottom variant="h4">
        Your cart is empty
      </Typography>
      <Typography gutterBottom>
        You haven’t added anything to your cart. I’m sure you’ll find something in my shop.
      </Typography>
    </Box>
    <Button href="/shop" color="primary">
      Continue shopping
    </Button>
  </Box>
);

export default CartEmpty;
