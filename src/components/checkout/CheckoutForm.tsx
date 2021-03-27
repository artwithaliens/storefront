import { Step, Stepper } from '@components/ui';
import { Grid } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { CartQuery, CheckoutMutationVariables, CustomerQuery } from '../../graphql';
import isShippingSameAsBilling from '../../utils/isShippingSameAsBilling';
import BillingForm from './BillingForm';
import CartSummary from './CartSummary';
import CheckoutReview from './CheckoutReview';
import PaymentMethods from './PaymentMethods';
import ShippingMethods from './ShippingMethods';
import ShippingForm from './ShippingForm';

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

const CheckoutForm: React.VFC<Props> = ({ cart, customer, loading, onSubmit }) => {
  const router = useRouter();

  const [creditCard, setCreditCard] = useState<{ cardType: string; lastFour: string }>();
  const [paymentMethod, setPaymentMethod] = useLocalStorage<string>('paymentMethod');
  const [paymentNonce, setPaymentNonce] = useState<string>();
  const [shipToDifferentAddress, setShipToDifferentAddress] = useState(
    !isShippingSameAsBilling(customer.shipping, customer.billing),
  );

  useEffect(() => {
    if (router.query.step === 'review' && paymentMethod === 'braintree_cc' && creditCard == null) {
      router.push('/checkout/billing-address');
    }
  }, [creditCard, paymentMethod, router]);

  /**
   * Handle changing steps.
   *
   * @param step The current step
   */
  const handleChangeStep = (step: Partial<{ path: string }>) => {
    // Everytime we change steps we have to check if both addresses match
    setShipToDifferentAddress(!isShippingSameAsBilling(customer.shipping, customer.billing));

    if (router.query.step != null && router.query.step !== step.path) {
      router.replace('/checkout/[step]', `/checkout/${step.path}`, { shallow: true });
    }
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
              <BillingForm defaultValues={customer.billing} onSubmit={handleNext} />
            </Step>,
            <Step key="shipping-address">
              <ShippingForm
                defaultValues={customer.shipping}
                shipToDifferentAddress={shipToDifferentAddress}
                onShippingSameAsBillingChange={handleShippingSameAsBillingChange}
                onSubmit={handleNext}
              />
            </Step>,
            <Step key="shipping-options">
              <ShippingMethods
                availableShippingMethods={cart.availableShippingMethods}
                chosenShippingMethods={cart.chosenShippingMethods}
                onSubmit={handleNext}
              />
            </Step>,
            <Step key="payment">
              <PaymentMethods
                customer={customer}
                paymentMethod={paymentMethod}
                onSubmit={(values) => {
                  setPaymentMethod(values.paymentMethod);
                  setPaymentNonce(values.paymentNonce);
                  setCreditCard(values.creditCard);
                  handleNext();
                }}
              />
            </Step>,
            <Step key="review">
              <CheckoutReview
                cart={cart}
                creditCard={creditCard}
                customer={customer}
                loading={loading}
                paymentMethod={paymentMethod}
                paymentNonce={paymentNonce}
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
