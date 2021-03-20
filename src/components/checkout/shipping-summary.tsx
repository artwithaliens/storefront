import { Price } from '@components/core';
import { Typography } from '@material-ui/core';
import React from 'react';
import { CartQuery } from '../../graphql';

type Props = {
  availableShippingMethods: NonNullable<CartQuery['cart']>['availableShippingMethods'];
  chosenShippingMethods: NonNullable<CartQuery['cart']>['chosenShippingMethods'];
};

const ShippingSummary: React.VFC<Props> = ({ availableShippingMethods, chosenShippingMethods }) => {
  const shippingMethod = availableShippingMethods?.[0]?.rates?.find(
    (rate) => rate != null && chosenShippingMethods?.includes(rate.id),
  );

  return (
    <Typography gutterBottom>
      {`${shippingMethod?.label} | `}
      <Price component="span">{shippingMethod?.cost}</Price>
    </Typography>
  );
};

export default ShippingSummary;
