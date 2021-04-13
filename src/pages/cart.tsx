import { isApolloError } from '@apollo/client';
import { CartEmpty, CartTable } from '@components/cart';
import { Layout } from '@components/core';
import { Button, Loader } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Box, Chip, Container, Grid, Stack, TextField, Typography } from '@material-ui/core';
import isBlank from '@utils/isBlank';
import { NextPage } from 'next';
import React, { useState } from 'react';
import {
  useAddCouponMutation,
  useCartQuery,
  useRemoveCouponMutation,
  useUpdateCartMutation,
} from '../graphql';

const Cart: NextPage = () => {
  const { addAlert } = useUI();
  const [coupon, setCoupon] = useState<string>();

  const { data: { cart } = { cart: undefined }, loading } = useCartQuery({
    fetchPolicy: 'no-cache',
    ssr: false,
  });

  const [updateCart, { loading: updating }] = useUpdateCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  const [addCoupon, { loading: addingCoupon }] = useAddCouponMutation({
    refetchQueries: ['Cart'],
  });
  const [removeCoupon, { loading: removingCoupon }] = useRemoveCouponMutation({
    refetchQueries: ['Cart'],
  });

  /** Handles adding coupons to the cart. */
  const handleAddCouponClick = async () => {
    if (!isBlank(coupon)) {
      try {
        await addCoupon({ variables: { code: coupon } });
      } catch (error) {
        if (isApolloError(error)) {
          addAlert(error.message, { severity: 'error' });
        }
      }
    }
  };

  const handleCouponDelete = async (code: string) => {
    removeCoupon({ variables: { code } });
  };

  return (
    <Layout>
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
              loading={updating || addingCoupon || removingCoupon}
              onUpdate={(values) => updateCart({ variables: values })}
            />
            <Grid container justifyContent="space-between">
              <Grid item xs={12} sm={4} sx={{ order: { xs: 2, sm: 1 } }}>
                <Box sx={{ mb: 4, mt: { xs: 0, sm: 4 } }}>
                  <Typography gutterBottom variant="h4">
                    I have a coupon
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      margin="none"
                      placeholder="Enter coupon code"
                      onChange={(event) => setCoupon(event.currentTarget.value)}
                    />
                    <Button
                      disabled={isBlank(coupon)}
                      loading={addingCoupon}
                      variant="contained"
                      onClick={handleAddCouponClick}
                    >
                      Add&nbsp;coupon
                    </Button>
                  </Stack>
                  <Box sx={{ mt: 2 }}>
                    {cart.appliedCoupons?.map(
                      (coupon) =>
                        coupon != null && (
                          <Chip
                            key={coupon.code}
                            color="secondary"
                            label={`Coupon "${coupon.code.toUpperCase()}"`}
                            onDelete={() => handleCouponDelete(coupon.code)}
                          />
                        ),
                    )}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ order: { xs: 1, sm: 2 } }}>
                <Box sx={{ my: 4 }}>
                  <Button fullWidth color="primary" href="/checkout/billing-address">
                    Proceed to Checkout
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Cart;
