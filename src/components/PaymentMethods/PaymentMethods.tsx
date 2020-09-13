import { Box, Radio, RadioGroup, styled, SvgIcon, Typography } from '@material-ui/core';
import React, { useRef, useState } from 'react';
import AmexSvg from '../../assets/payment-gateways/amex.svg';
import VisaSvg from '../../assets/payment-gateways/visa.svg';
import { makePayment } from '../../braintree';
import { usePaymentGatewaysQuery } from '../../graphql';
import isBlank from '../../utils/isBlank';
import Button from '../Button';
import CreditCardForm from '../CreditCardForm';
import { CreditCardInput } from '../CreditCardForm/CreditCardForm';

const PaymentMethodsLabel = styled('label')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  display: 'flex',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
}));

type Props = {
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

const PaymentMethods: React.FC<Props> = ({ onSubmit, paymentMethod: initialPaymentMethod }) => {
  const creditCardFormRef = useRef<HTMLFormElement>(null);

  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod);

  const { data: { paymentGateways } = { data: undefined }, loading } = usePaymentGatewaysQuery();

  const handleSubmitCreditCard = (values: CreditCardInput) => {
    const creditCard = {
      billingAddress: { postalCode: '' },
      cvv: values.ccCsc,
      expirationDate: values.ccExp,
      number: values.ccNumber,
    };
    makePayment(process.env.BRAINTREE_TOKENIZATION_KEY, creditCard).then((data) => {
      onSubmit({
        creditCard: {
          cardType: data.cardType,
          lastFour: data.lastFour,
        },
        paymentMethod,
        paymentNonce: data.nonce,
      });
    });
  };

  const handleSubmit = () => {
    if (creditCardFormRef.current != null) {
      if (creditCardFormRef.current.checkValidity()) {
        creditCardFormRef.current.dispatchEvent(new Event('submit', { cancelable: true }));
      } else {
        creditCardFormRef.current.reportValidity();
      }
    }
    if (paymentMethod === 'braintree_paypal') {
      onSubmit({ paymentMethod });
    }
  };

  return (
    <>
      <RadioGroup name="paymentMode">
        {paymentGateways?.nodes?.map(
          (paymentGateway) =>
            paymentGateway != null && (
              <React.Fragment key={paymentGateway.id}>
                <PaymentMethodsLabel htmlFor={`paymentMode-${paymentGateway.id}`}>
                  <div>
                    <Radio
                      value={paymentGateway.id}
                      id={`paymentMode-${paymentGateway.id}`}
                      checked={paymentMethod === paymentGateway.id}
                      onChange={() => setPaymentMethod(paymentGateway.id)}
                    />
                  </div>
                  <Box flexGrow={1} ml={2}>
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
                    {paymentGateway.id === 'braintree_cc' &&
                      paymentMethod === paymentGateway.id && (
                        <CreditCardForm
                          formRef={creditCardFormRef}
                          onSubmit={handleSubmitCreditCard}
                        />
                      )}
                  </Box>
                </PaymentMethodsLabel>
              </React.Fragment>
            ),
        )}
      </RadioGroup>
      <Box mt={2}>
        <Button type="submit" color="primary" loading={loading} onClick={handleSubmit}>
          Continue to Review Your Order
        </Button>
      </Box>
    </>
  );
};
export default PaymentMethods;
