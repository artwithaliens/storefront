import { Grid, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';
import { CartQuery, CheckoutMutationVariables, CustomerQuery } from '../../graphql';
import isShippingSameAsBilling from '../../utils/isShippingSameAsBilling';
import Step from '../Step';
import Stepper from '../Stepper';
import BillingForm from './BillingForm';
import CartSummary from './CartSummary';
import CheckoutReview from './CheckoutReview';
import PaymentMethods from './PaymentMethods';
import ShippingForm from './ShippingForm';
import ShippingMethods from './ShippingMethods';

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  customer: NonNullable<CustomerQuery['customer']>;
  loading: boolean;
  onSubmit: (
    values: Pick<
      CheckoutMutationVariables,
      'customerNote' | 'metaData' | 'paymentMethod' | 'shipToDifferentAddress' | 'transactionId'
    >,
  ) => void;
};

const CheckoutForm: React.FC<Props> = ({ cart, customer, loading, onSubmit }) => {
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useLocalStorage<string>('paymentMethod');
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(
    !isShippingSameAsBilling(customer.shipping, customer.billing),
  );

  const handleChangeStep = (step: Partial<{ path: string }>) => {
    if (router.query.step != null && router.query.step !== step.path) {
      router.push('/checkout/[step]', `/checkout/${step.path}`, { shallow: true });
    }
  };

  const handlePaymentMethodChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(ev.target.value);
  };

  const handleShippingSameAsBillingChange = (shippingSameAsBilling: boolean) => {
    setShipToDifferentAddress(!shippingSameAsBilling);
  };

  const handleSubmit = ({
    customerNote,
    metaData,
    transactionId,
  }: Pick<CheckoutMutationVariables, 'customerNote' | 'metaData' | 'transactionId'>) => {
    if (paymentMethod != null) {
      onSubmit({
        customerNote,
        metaData,
        paymentMethod,
        shipToDifferentAddress,
        transactionId,
      });
    }
  };

  if (!loading && (cart.contents?.itemCount ?? 0) === 0) {
    return <Typography>Your cart is empty.</Typography>;
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Stepper
          steps={[
            { path: 'billing-address', title: 'Billing Address' },
            { path: 'shipping-address', title: 'Shipping Address' },
            { path: 'shipping-options', title: 'Shipping Method' },
            { path: 'payment', title: 'Payment Method' },
            { path: 'review', title: 'Review' },
          ]}
          activeStep={`${router.query.step}`}
          onChangeStep={handleChangeStep}
        >
          {({ handleNext }) => [
            <Step key="billing-address">
              <BillingForm initialValues={customer.billing} onSubmit={handleNext} />
            </Step>,
            <Step key="shipping-address">
              <ShippingForm
                initialValues={customer.shipping}
                shipToDifferentAddress={shipToDifferentAddress}
                onSubmit={handleNext}
                onShippingSameAsBillingChange={handleShippingSameAsBillingChange}
              />
            </Step>,
            <Step key="shipping-options">
              <ShippingMethods
                availableShippingMethods={cart.availableShippingMethods}
                chosenShippingMethod={cart.chosenShippingMethod}
                onSubmit={handleNext}
              />
            </Step>,
            <Step key="payment">
              <PaymentMethods
                paymentMethod={paymentMethod}
                onChange={handlePaymentMethodChange}
                onFinish={handleNext}
              />
            </Step>,
            <Step key="review">
              <CheckoutReview
                cart={cart}
                customer={customer}
                loading={loading}
                paymentMethod={paymentMethod}
                onSubmit={handleSubmit}
              />
            </Step>,
          ]}
        </Stepper>
      </Grid>
      <Grid item xs={12} md={4}>
        <CartSummary cart={cart} />
      </Grid>
    </Grid>
  );
};

export default CheckoutForm;
