import {
  Box,
  Button,
  Grid,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { CartQuery, useUpdateShippingMethodMutation } from '../../graphql';
import Price from '../Price';

const useStyles = makeStyles(
  ({ spacing }) => ({
    item: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      padding: spacing(2),
    },
  }),
  { name: 'ShippingMethods' },
);

type Props = {
  availableShippingMethods: NonNullable<CartQuery['cart']>['availableShippingMethods'];
  chosenShippingMethod: NonNullable<CartQuery['cart']>['chosenShippingMethod'];
  onSubmit: () => void;
};

const ShippingMethods: React.FC<Props> = ({
  availableShippingMethods,
  chosenShippingMethod,
  onSubmit,
}) => {
  const styles = useStyles();
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
        defaultValue={chosenShippingMethod ?? undefined}
        onChange={handleChange}
      >
        <Grid container spacing={2}>
          {availableShippingMethods?.[0]?.rates?.map(
            (rate) =>
              rate != null && (
                <Grid key={rate.id} item xs={12} lg={6}>
                  <Paper component="label" className={styles.item}>
                    <div>
                      <Radio value={rate.id} disabled={loading} />
                    </div>
                    <Box ml={2}>
                      <Typography>{rate.label}</Typography>
                      <Price>{rate.cost}</Price>
                    </Box>
                  </Paper>
                </Grid>
              ),
          )}
        </Grid>
      </RadioGroup>
      <Box mt={2}>
        <Button
          type="submit"
          color="primary"
          disabled={loading || chosenShippingMethod == null}
          onClick={onSubmit}
        >
          {loading ? 'Loading' : 'Continue to Payment Method'}
        </Button>
      </Box>
    </>
  );
};

export default ShippingMethods;
