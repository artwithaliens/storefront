import { Edit } from '@components/icons';
import { Button, IconButton, Link, Loader } from '@components/ui';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useAsyncFn } from 'react-use';
import { CartQuery, CheckoutMutationVariables, CustomerQuery } from '../../graphql';
import AddressSummary from './AddressSummary';
import PaymentSummary from './PaymentSummary';
import PaypalButton from './PaypalButton';
import ShippingSummary from './ShippingSummary';

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

  const [{ loading: paymentLoading }, handlePayment] = useAsyncFn(async (nonce?: string) => {
    const response = await fetch('/api/payment', {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        nonce,
        total: cart.total == null ? undefined : parseFloat(cart.total),
      }),
    });
    const data = (await response.json()) as PaymentResponse;
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
    });
  });

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
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h4">Billing Address</Typography>
            <IconButton href="/checkout/billing-address" size="small">
              <Edit fontSize="inherit" />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <AddressSummary address={customer.billing} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h4">Shipping Address</Typography>
            <IconButton href="/checkout/shipping-address" size="small">
              <Edit fontSize="inherit" />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <AddressSummary address={customer.shipping} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h4">Shipping Method</Typography>
            <IconButton href="/checkout/shipping-options" size="small">
              <Edit fontSize="inherit" />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <ShippingSummary
              availableShippingMethods={cart.availableShippingMethods}
              chosenShippingMethods={cart.chosenShippingMethods}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="h4">Payment Method</Typography>
            <IconButton href="/checkout/payment" size="small">
              <Edit fontSize="inherit" />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <PaymentSummary chosenPaymentMethod={paymentMethod} creditCard={creditCard} />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 6 }}>
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
                <Link href="/terms">Terms &amp; Conditions</Link> your{' '}
                <Link href="/revocation">Right of Recission</Link> and our{' '}
                <Link href="/privacy-policy">Privacy Policy</Link>.
              </>
            }
          />
        </FormGroup>
      </Box>
      <Box sx={{ mt: 6 }}>
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
