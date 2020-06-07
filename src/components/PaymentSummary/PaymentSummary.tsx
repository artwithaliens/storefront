import { Typography } from '@material-ui/core';
import React from 'react';
import { usePaymentGatewaysQuery } from '../../graphql';

type Props = {
  chosenPaymentMethod?: string | null;
};

const PaymentSummary: React.FC<Props> = ({ chosenPaymentMethod }) => {
  const { data: { paymentGateways } = { data: undefined } } = usePaymentGatewaysQuery();

  const paymentMethod = paymentGateways?.nodes?.find(
    (paymentGateway) => paymentGateway?.id === chosenPaymentMethod,
  );

  return <Typography gutterBottom>{`${paymentMethod?.title}`}</Typography>;
};

export default PaymentSummary;
