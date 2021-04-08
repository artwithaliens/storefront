import { TextField } from '@material-ui/core';
import mapValues from 'lodash/mapValues';
import startCase from 'lodash/startCase';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PartialDeep } from 'type-fest';
import { ProductVariation, VariableProduct } from '../../graphql';
import getVariations from '../../utils/getVariations';

type Props = {
  onChange: (variation?: PartialDeep<ProductVariation>) => void;
  product: PartialDeep<VariableProduct>;
};

const VariationForm: React.VFC<Props> = ({ onChange, product }) => {
  const variations = getVariations(product);

  const { control, watch } = useForm({
    defaultValues: mapValues(variations, () => ''),
    mode: 'onChange',
  });

  watch((values) => {
    const variation = product.variations?.nodes?.find((variation) =>
      variation?.attributes?.nodes?.every(
        (attribute) => attribute?.name != null && attribute.value === values[attribute.name],
      ),
    );
    onChange(variation ?? undefined);
  });

  return (
    <form>
      {Object.entries(getVariations(product)).map(([name, attribute]) => (
        <Controller
          key={name}
          control={control}
          name={name}
          render={({ field }) => (
            <TextField
              select
              margin="normal"
              label={startCase(name.replace(/^pa_/, ''))}
              SelectProps={{
                native: true,
              }}
              {...field}
            >
              <option value="">Select a {name.replace(/^pa_/, '')}...</option>
              {attribute.options.map((option) => (
                <option
                  key={option}
                  // disabled={variation.stockStatus === StockStatusEnum.OUT_OF_STOCK}
                  value={option}
                >
                  {option}
                  {/* {variation.stockStatus === StockStatusEnum.OUT_OF_STOCK && ' (Sold out)'} */}
                </option>
              ))}
            </TextField>
          )}
        />
      ))}
    </form>
  );
};

export default VariationForm;
