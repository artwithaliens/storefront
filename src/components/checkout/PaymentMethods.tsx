import { Button } from '@components/ui';
import { Box, Radio, RadioGroup, styled, SvgIcon, Typography } from '@material-ui/core';
import isBlank from '@utils/isBlank';
import React, { useRef, useState } from 'react';
import AmexSvg from '../../assets/payment-gateways/amex.svg';
import VisaSvg from '../../assets/payment-gateways/visa.svg';
import { makePayment } from '../../braintree';
import { CustomerQuery, usePaymentGatewaysQuery } from '../../graphql';
import CreditCardForm, { CreditCardFormData } from './CreditCardForm';

const PaymentMethodsLabel = styled('label')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  display: 'flex',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

type Props = {
  customer: NonNullable<CustomerQuery['customer']>;
  onSubmit: (values: {
    creditCard?: {
      cardType: string;
      lastFour: string;
    };
    paymentMethod?: string;
    paymentNonce?: string;
  }) => void;
  paymentMethod?: string;
};

const PaymentMethods: React.VFC<Props> = ({
  customer,
  onSubmit,
  paymentMethod: initialPaymentMethod,
}) => {
  const creditCardFormRef = useRef<HTMLFormElement>(null);

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);
  const [loading, setLoading] = useState(false);

  const {
    data: { paymentGateways } = { data: undefined },
    loading: paymentGatewaysLoading,
  } = usePaymentGatewaysQuery();

  const handleSubmitCreditCard = async (values: CreditCardFormData) => {
    setLoading(true);
    const data = await makePayment(process.env.BRAINTREE_TOKENIZATION_KEY, {
      billingAddress: {
        postalCode: customer.billing?.postcode ?? undefined,
      },
      cvv: values.ccCsc,
      expirationDate: values.ccExp,
      number: values.ccNumber,
    });
    setLoading(false);
    onSubmit({
      creditCard: {
        cardType: data.cardType,
        lastFour: data.lastFour,
      },
      paymentMethod,
      paymentNonce: data.nonce,
    });
  };

  const handleSubmit = () => {
    if (creditCardFormRef.current != null) {
      if (creditCardFormRef.current.checkValidity()) {
        // The following line is not working anymore for some reason:
        // creditCardFormRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
        // So I have overridden the `submit` method, see in `CreditCardForm`
        creditCardFormRef.current.submit();
      } else {
        creditCardFormRef.current.reportValidity();
      }
    }
    if (paymentMethod === 'braintree_paypal') {
      onSubmit({ paymentMethod });
    }
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(ev.target.value);
  };

  return (
    <>
      <RadioGroup name="paymentMode" value={paymentMethod} onChange={handleChange}>
        {paymentGateways?.nodes?.map(
          (paymentGateway) =>
            paymentGateway != null && (
              <PaymentMethodsLabel
                key={paymentGateway.id}
                htmlFor={`paymentMode-${paymentGateway.id}`}
              >
                <div>
                  <Radio value={paymentGateway.id} id={`paymentMode-${paymentGateway.id}`} />
                </div>
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography variant="h5">{paymentGateway.title}</Typography>
                  {paymentGateway.icon != null ? (
                    <img src={paymentGateway.icon} alt="" height="24" />
                  ) : (
                    paymentGateway.id === 'braintree_cc' && (
                      <>
                        <SvgIcon component={AmexSvg} viewBox="0 0 30 30" fontSize="large" />{' '}
                        <SvgIcon component={VisaSvg} viewBox="0 0 30 30" fontSize="large" />
                      </>
                    )
                  )}
                  {!isBlank(paymentGateway.description) && (
                    <Typography variant="body2">{paymentGateway.description}</Typography>
                  )}
                  {paymentGateway.id === 'braintree_cc' && paymentMethod === paymentGateway.id && (
                    <CreditCardForm ref={creditCardFormRef} onSubmit={handleSubmitCreditCard} />
                  )}
                </Box>
              </PaymentMethodsLabel>
            ),
        )}
      </RadioGroup>
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          color="primary"
          loading={paymentGatewaysLoading || loading}
          onClick={handleSubmit}
        >
          Continue to Review Your Order
        </Button>
      </Box>
    </>
  );
};

export default PaymentMethods;
