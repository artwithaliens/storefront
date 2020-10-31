import { Box, Container } from '@material-ui/core';
import omit from 'lodash/omit';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import CheckoutForm from '../../components/checkout/checkout-form';
import PageWrapper from '../../components/core/page-wrapper';
import { Loader } from '../../components/ui';
import {
  CheckoutMutationVariables,
  useCartQuery,
  useCheckoutMutation,
  useCustomerQuery,
} from '../../graphql';

const Checkout: NextPage = () => {
  const router = useRouter();

  const { data: { cart } = { cart: undefined }, loading: cartLoading } = useCartQuery({
    fetchPolicy: 'no-cache',
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
    <PageWrapper>
      <Head>
        <script async data-version-4 src="https://www.paypalobjects.com/api/checkout.js" />
      </Head>
      {cart == null || cartLoading || customer == null || customerLoading ? (
        <Loader fullHeight />
      ) : (
        <Container>
          <Box sx={{ mb: 4, mt: 6 }}>
            <CheckoutForm
              cart={cart}
              customer={customer}
              loading={checkoutLoading || checkoutCalled}
              onSubmit={handleSubmit}
            />
          </Box>
        </Container>
      )}
    </PageWrapper>
  );
};

export default Checkout;
