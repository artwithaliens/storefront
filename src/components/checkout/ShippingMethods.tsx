import { Button, Price } from '@components/ui';
import { Box, Grid, Radio, RadioGroup, styled, Typography } from '@material-ui/core';
import React from 'react';
import { CartQuery, useUpdateShippingMethodMutation } from '../../graphql';

const ShippingMethodsLabel = styled('label')(({ theme }) => ({
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  padding: theme.spacing(2),
}));

type Props = {
  availableShippingMethods: NonNullable<CartQuery['cart']>['availableShippingMethods'];
  chosenShippingMethods: NonNullable<CartQuery['cart']>['chosenShippingMethods'];
  onSubmit: () => void;
};

const ShippingMethods: React.VFC<Props> = ({
  availableShippingMethods,
  chosenShippingMethods,
  onSubmit,
}) => {
  const [updateShippingMethod, { loading }] = useUpdateShippingMethodMutation({
    refetchQueries: ['Cart'],
  });

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    updateShippingMethod({ variables: { shippingMethods: [ev.target.value] } });
  };

  return (
    <>
      <RadioGroup
        name="shippingMethod"
        value={chosenShippingMethods?.[0] ?? undefined}
        onChange={handleChange}
      >
        <Grid container spacing={2}>
          {availableShippingMethods?.[0]?.rates?.map(
            (rate) =>
              rate != null && (
                <Grid key={rate.id} item xs={12} lg={6}>
                  <ShippingMethodsLabel htmlFor={`shippingMethod-${rate.id}`}>
                    <div>
                      <Radio value={rate.id} id={`shippingMethod-${rate.id}`} disabled={loading} />
                    </div>
                    <Box sx={{ flexGrow: 1, ml: 2 }}>
                      <Typography>{rate.label}</Typography>
                      <Price>{rate.cost}</Price>
                    </Box>
                  </ShippingMethodsLabel>
                </Grid>
              ),
          )}
        </Grid>
      </RadioGroup>
      <Box sx={{ mt: 2 }}>
        <Button
          type="submit"
          color="primary"
          disabled={chosenShippingMethods == null}
          loading={loading}
          onClick={onSubmit}
        >
          Continue to Payment Method
        </Button>
      </Box>
    </>
  );
};

export default ShippingMethods;
