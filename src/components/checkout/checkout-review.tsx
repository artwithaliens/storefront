import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { useAsyncFn } from 'react-use';
import EditSvg from '../../assets/icons/edit.svg';
import { CartQuery, CheckoutMutationVariables, CustomerQuery } from '../../graphql';
import Button from '../global/button';
import Link from '../global/link';
import Loader from '../global/loader';
import AddressSummary from './address-summary';
import PaymentSummary from './payment-summary';
import PaypalButton from './paypal-button';
import ShippingSummary from './shipping-summary';

type PaymentResponse = {
  transaction: {
    id: string;
    status: string;
  };
};

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  creditCard?: {
    cardType: string;
    lastFour: string;
  };
  customer: NonNullable<CustomerQuery['customer']>;
  loading: boolean;
  onSubmit: (
    values: Pick<CheckoutMutationVariables, 'customerNote' | 'metaData' | 'transactionId'>,
  ) => void;
  paymentMethod: string | null | undefined;
  paymentNonce: string | undefined;
};

const CheckoutReview: React.VFC<Props> = ({
  cart,
  creditCard,
  customer,
  loading,
  onSubmit,
  paymentMethod,
  paymentNonce,
}) => {
  const [customerNote, setCustomerNote] = useState<string>();
  const [acceptTerms, setAcceptsTerms] = useState(false);

  const [{ loading: paymentLoading }, handlePayment] = useAsyncFn((nonce?: string) =>
    fetch('/api/payment', {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        nonce,
        total: cart.total == null ? undefined : parseFloat(cart.total),
      }),
    })
      .then((response) => response.json() as Promise<PaymentResponse>)
      .then((data) =>
        onSubmit({
          customerNote,
          metaData: [
            {
              key: '_merchant_account_id',
              value: process.env.BRAINTREE_MERCHANT_ID,
            },
            {
              key: '_wc_braintree_environment',
              value: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
            },
            {
              key: '_transaction_status',
              value: data.transaction.status,
            },
          ],
          transactionId: data.transaction.id,
        }),
      ),
  );

  const handleSubmit = () => {
    handlePayment(paymentNonce);
  };

  if (loading || paymentLoading) {
    return <Loader />;
  }

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Box
            mb={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Billing Address</Typography>
            <NextLink passHref href="/checkout/[step]" as="/checkout/billing-address">
              <IconButton size="small">
                <SvgIcon fontSize="inherit" component={EditSvg} />
              </IconButton>
            </NextLink>
          </Box>
          <Divider />
          <Box mt={2}>
            <AddressSummary address={customer.billing} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            mb={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Shipping Address</Typography>
            <NextLink passHref href="/checkout/[step]" as="/checkout/shipping-address">
              <IconButton size="small">
                <SvgIcon fontSize="inherit" component={EditSvg} />
              </IconButton>
            </NextLink>
          </Box>
          <Divider />
          <Box mt={2}>
            <AddressSummary address={customer.shipping} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            mb={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Shipping Method</Typography>
            <NextLink passHref href="/checkout/[step]" as="/checkout/shipping-options">
              <IconButton size="small">
                <SvgIcon fontSize="inherit" component={EditSvg} />
              </IconButton>
            </NextLink>
          </Box>
          <Divider />
          <Box mt={2}>
            <ShippingSummary
              availableShippingMethods={cart.availableShippingMethods}
              chosenShippingMethod={cart.chosenShippingMethod}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            mb={1}
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h4">Payment Method</Typography>
            <NextLink passHref href="/checkout/[step]" as="/checkout/payment">
              <IconButton size="small">
                <SvgIcon fontSize="inherit" component={EditSvg} />
              </IconButton>
            </NextLink>
          </Box>
          <Divider />
          <Box mt={2}>
            <PaymentSummary chosenPaymentMethod={paymentMethod} creditCard={creditCard} />
          </Box>
        </Grid>
      </Grid>
      <Box mt={6}>
        <TextField
          multiline
          label="Note"
          placeholder="Please sign my prints"
          rows={3}
          onChange={(ev) => setCustomerNote(ev.target.value)}
        />
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="acceptTerms"
                checked={acceptTerms}
                onChange={(ev) => setAcceptsTerms(ev.target.checked)}
              />
            }
            label={
              <>
                With your order, you agree to have read and understood our{' '}
                <Link href="/[slug]" as="/terms">
                  Terms &amp; Conditions
                </Link>{' '}
                your{' '}
                <Link href="/[slug]" as="/revocation">
                  Right of Recission
                </Link>{' '}
                and our{' '}
                <Link href="/[slug]" as="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </>
            }
          />
        </FormGroup>
      </Box>
      <Box mt={6}>
        {paymentMethod === 'braintree_paypal' ? (
          <PaypalButton
            cart={cart}
            disabled={!acceptTerms}
            shipping={customer.shipping}
            paymentClientToken={process.env.BRAINTREE_TOKENIZATION_KEY}
            onAuthorize={(nonce) => handlePayment(nonce)}
          />
        ) : (
          <Button fullWidth color="primary" disabled={!acceptTerms} onClick={handleSubmit}>
            Place your order
          </Button>
        )}
      </Box>
    </>
  );
};

export default CheckoutReview;
