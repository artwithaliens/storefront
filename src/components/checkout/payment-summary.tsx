import { Typography } from '@material-ui/core';
import React from 'react';
import { usePaymentGatewaysQuery } from '../../graphql';

type Props = {
  chosenPaymentMethod?: string | null;
  creditCard?: {
    cardType: string;
    lastFour: string;
  };
};

const PaymentSummary: React.FC<Props> = ({ chosenPaymentMethod, creditCard }) => {
  const { data: { paymentGateways } = { data: undefined } } = usePaymentGatewaysQuery();

  const paymentMethod = paymentGateways?.nodes?.find(
    (paymentGateway) => paymentGateway?.id === chosenPaymentMethod,
  );

  return (
    <Typography gutterBottom>
      {`${paymentMethod?.title}`}
      {chosenPaymentMethod === 'braintree_cc' &&
        ` | ${creditCard?.cardType}: ${creditCard?.lastFour}`}
    </Typography>
  );
};

export default PaymentSummary;
