import { Box, Container, Grid, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import CartEmpty from '../components/cart/cart-empty';
import CartTable from '../components/cart/cart-table';
import Button from '../components/global/button';
import Loader from '../components/global/loader';
import PageWrapper from '../components/global/page-wrapper';
import { useCartQuery, useUpdateCartMutation } from '../graphql';

const Cart: NextPage = () => {
  const { data: { cart } = { cart: undefined }, loading } = useCartQuery({ ssr: false });

  const [updateCart, { loading: updating }] = useUpdateCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  return (
    <PageWrapper>
      <Container>
        <Box mt={6} mb={2}>
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
            <Box my={4}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={12} sm={4}>
                  <Button fullWidth href="/checkout/billing-address" color="primary">
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
