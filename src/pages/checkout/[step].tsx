import { Box, Container } from '@material-ui/core';
import omit from 'lodash/omit';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CheckoutForm from '../../components/CheckoutForm';
import Layout from '../../components/Layout';
import Loader from '../../components/Loader';
import {
  CheckoutMutationVariables,
  useCartQuery,
  useCheckoutMutation,
  useCustomerQuery,
} from '../../graphql';

const Checkout: NextPage = () => {
  const router = useRouter();

  const { data: { cart } = { cart: undefined }, loading: cartLoading } = useCartQuery({
    ssr: false,
  });
  const {
    data: { customer } = { customer: undefined },
    loading: customerLoading,
  } = useCustomerQuery({ ssr: false });

  const [checkout, { loading: checkoutLoading, called: checkoutCalled }] = useCheckoutMutation({
    refetchQueries: ['Cart', 'Customer'],
  });

  useEffect(() => {
    if (!cartLoading && !checkoutCalled && cart != null && (cart.contents?.itemCount ?? 0) === 0) {
      router.push('/');
    }
  }, [cart, cartLoading, checkoutCalled, router]);

  const handleSubmit = (
    values: Pick<
      CheckoutMutationVariables,
      'customerNote' | 'metaData' | 'paymentMethod' | 'shipToDifferentAddress' | 'transactionId'
    >,
  ) => {
    checkout({
      variables: {
        ...values,
        billing: omit(customer?.billing, '__typename'),
        isPaid: true,
        shipping: omit(customer?.shipping, '__typename'),
        shippingMethod: cart?.chosenShippingMethod,
      },
    }).then(() => {
      router.push('/order-confirmation');
    });
  };

  return (
    <Layout>
      {cart == null || cartLoading || customer == null || customerLoading ? (
        <Loader full />
      ) : (
        <Container>
          <Box mt={6} mb={4}>
            <CheckoutForm
              cart={cart}
              customer={customer}
              loading={checkoutLoading || checkoutCalled}
              onSubmit={handleSubmit}
            />
          </Box>
        </Container>
      )}
    </Layout>
  );
};

export default Checkout;
