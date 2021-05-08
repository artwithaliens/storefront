import { Button, ColorSwatch } from '@components/ui';
import { Box, Stack, Typography } from '@material-ui/core';
import getVariations from '@utils/getVariations';
import mapValues from 'lodash/mapValues';
import startCase from 'lodash/startCase';
import React, { useEffect } from 'react';
import { useSetState } from 'react-use';
import { PartialDeep } from 'type-fest';
import { ProductVariation, VariableProduct } from '../../graphql';

type Props = {
  onChange: (variation?: PartialDeep<ProductVariation>) => void;
  product: PartialDeep<VariableProduct>;
};

const VariationForm: React.VFC<Props> = ({ onChange, product }) => {
  const variations = getVariations(product);

  const [formState, setFormState] = useSetState<Record<string, string | undefined>>(
    mapValues(variations, () => undefined),
  );

  useEffect(() => {
    const variation = product.variations?.nodes?.find((variation) =>
      variation?.attributes?.nodes?.every(
        (attribute) => attribute?.name != null && attribute.value === formState[attribute.name],
      ),
    );
    onChange(variation ?? undefined);
  }, [formState, onChange, product]);

  return (
    <div>
      {Object.entries(variations).map(([name, attribute]) => (
        <Box key={name} sx={{ my: 2 }}>
          <Typography gutterBottom variant="h4">
            {startCase(name.replace(/^pa_/, ''))}
          </Typography>
          <Stack direction="row" spacing={1}>
            {attribute.options.map((option) =>
              name === 'pa_color' ? (
                <ColorSwatch
                  key={option}
                  color={option}
                  selected={option === formState[name]}
                  onClick={() => {
                    setFormState({ [name]: option });
                  }}
                />
              ) : (
                <Button
                  key={option}
                  circle
                  color={option === formState[name] ? 'primary' : 'secondary'}
                  variant={option === formState[name] ? 'contained' : 'outlined'}
                  onClick={() => {
                    setFormState({ [name]: option });
                  }}
                >
                  {option}
                </Button>
              ),
            )}
          </Stack>
        </Box>
      ))}
    </div>
  );
};

export default VariationForm;
