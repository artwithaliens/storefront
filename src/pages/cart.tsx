import { Box, Container, Grid, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Button from '../components/Button';
import EmptyCart from '../components/cart/EmptyCart';
import CartTable from '../components/CartTable';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { useCartQuery, useUpdateCartMutation } from '../graphql';

const Cart: NextPage = () => {
  const { data: { cart } = { cart: undefined }, loading } = useCartQuery({ ssr: false });
  const [updateCart, { loading: updating }] = useUpdateCartMutation({ refetchQueries: ['Cart'] });

  return (
    <Layout>
      <Container>
        <Box mt={6} mb={2}>
          <Typography variant="h1">Cart</Typography>
        </Box>
        {loading ? (
          <Loader />
        ) : cart == null || (cart?.contents?.itemCount ?? 0) === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <CartTable
              cart={cart}
              loading={updating}
              onUpdate={(values) => updateCart({ variables: values })}
            />
            <Box my={4}>
              <Grid container justify="flex-end">
                <Grid item xs={12} sm={4}>
                  <Button
                    fullWidth
                    href="/checkout/[step]"
                    as="/checkout/billing-address"
                    color="primary"
                  >
                    Proceed to Checkout
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Cart;
