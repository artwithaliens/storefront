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
import { CartQuery, CheckoutMutationVariables, CustomerQuery, MetaDataInput } from '../../graphql';
import EditSvg from '../../icons/edit.svg';
import AddressSummary from '../AddressSummary';
import Button from '../Button';
import Link from '../Link';
import Loader from '../Loader';
import PayPalButton from '../PayPalButton';
import PaymentSummary from './PaymentSummary';
import ShippingSummary from './ShippingSummary';

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  customer: NonNullable<CustomerQuery['customer']>;
  loading: boolean;
  onSubmit: (
    values: Pick<CheckoutMutationVariables, 'customerNote' | 'metaData' | 'transactionId'>,
  ) => void;
  paymentMethod: string | null | undefined;
};

const CheckoutReview: React.FC<Props> = ({ cart, customer, loading, onSubmit, paymentMethod }) => {
  const [customerNote, setCustomerNote] = useState<string>();
  const [acceptTerms, setAcceptsTerms] = useState(false);

  const metaData: MetaDataInput[] = [
    {
      key: '_merchant_account_id',
      value: process.env.BRAINTREE_MERCHANT_ID,
    },
    {
      key: '_wc_braintree_environment',
      value: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    },
  ];

  const [{ loading: paymentLoading }, handlePayment] = useAsyncFn(async (nonce?: string) =>
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
      .then(
        (response) => response.json() as Promise<{ transaction: { id: string; status: string } }>,
      )
      .then(({ transaction }) => {
        metaData.push({
          key: '_transaction_status',
          value: transaction.status,
        });
        onSubmit({
          customerNote,
          metaData,
          transactionId: transaction.id,
        });
      }),
  );

  const handleCustomerNoteChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomerNote(ev.target.value);
  };

  const handleAcceptTermsChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptsTerms(ev.target.checked);
  };

  const handleSubmit = () => {
    onSubmit({ customerNote, metaData });
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
            <PaymentSummary chosenPaymentMethod={paymentMethod} />
          </Box>
        </Grid>
      </Grid>
      <Box mt={6}>
        <FormGroup>
          <TextField
            multiline
            label="Note"
            placeholder="Please sign my prints"
            rows={3}
            onChange={handleCustomerNoteChange}
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="acceptTerms"
                checked={acceptTerms}
                onChange={handleAcceptTermsChange}
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
          <PayPalButton
            cart={cart}
            disabled={!acceptTerms}
            shipping={customer.shipping}
            paymentClientToken={process.env.BRAINTREE_TOKENIZATION_KEY}
            onAuthorize={(nonce) => handlePayment(nonce)}
          />
        ) : (
          <Button fullWidth color="primary" onClick={handleSubmit}>
            Place your order
          </Button>
        )}
      </Box>
    </>
  );
};

export default CheckoutReview;
