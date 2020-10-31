import { Box, Container, Grid, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import CartEmpty from '../components/cart/cart-empty';
import CartTable from '../components/cart/cart-table';
import PageWrapper from '../components/core/page-wrapper';
import { Button, Loader } from '../components/ui';
import { useCartQuery, useUpdateCartMutation } from '../graphql';

const Cart: NextPage = () => {
  const { data: { cart } = { cart: undefined }, loading } = useCartQuery({
    fetchPolicy: 'no-cache',
    ssr: false,
  });

  const [updateCart, { loading: updating }] = useUpdateCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  return (
    <PageWrapper>
      <Container>
        <Box sx={{ mb: 2, mt: 6 }}>
          <Typography variant="h1">Cart</Typography>
        </Box>
        {loading ? (
          <Loader />
        ) : cart == null || (cart?.contents?.itemCount ?? 0) === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <CartTable
              cart={cart}
              loading={updating}
              onUpdate={(values) => updateCart({ variables: values })}
            />
            <Box sx={{ my: 4 }}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12} sm={4}>
                  <Button fullWidth color="primary" href="/checkout/billing-address">
                    Proceed to Checkout
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </PageWrapper>
  );
};

export default Cart;
