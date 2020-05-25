import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useLocalStorage } from 'react-use';
import { CartQuery, CheckoutMutationVariables, CustomerQuery } from '../../graphql';
import isShippingSameAsBilling from '../../utils/isShippingSameAsBilling';
import CartSummary from '../CartSummary';
import Step from '../Step';
import Stepper from '../Stepper';
import BillingForm from './BillingForm';
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

  /**
   * Handle changing steps.
   *
   * @param step The current step
   */
  const handleChangeStep = (step: Partial<{ path: string }>) => {
    // Everytime we change steps we have to check if both addresses match
    setShipToDifferentAddress(!isShippingSameAsBilling(customer.shipping, customer.billing));

    if (router.query.step != null && router.query.step !== step.path) {
      router.push('/checkout/[step]', `/checkout/${step.path}`, { shallow: true });
    }
  };

  /**
   * Called when the payment method changes.
   *
   * @param ev Event
   */
  const handlePaymentMethodChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(ev.target.value);
  };

  /**
   * Called when the user wants both addresses to be the same.
   *
   * @param shippingSameAsBilling Whether addresses should match or not
   */
  const handleShippingSameAsBillingChange = (shippingSameAsBilling: boolean) => {
    setShipToDifferentAddress(!shippingSameAsBilling);
  };

  /**
   * Handle submit of last step.
   */
  const handleSubmit = ({
    customerNote,
    metaData,
    transactionId,
  }: Pick<CheckoutMutationVariables, 'customerNote' | 'metaData' | 'transactionId'>) => {
    onSubmit({
      customerNote,
      metaData,
      paymentMethod,
      shipToDifferentAddress,
      transactionId,
    });
  };

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
