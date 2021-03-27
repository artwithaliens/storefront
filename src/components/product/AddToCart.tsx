import { isApolloError } from '@apollo/client';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Box, TextField, Stack } from '@material-ui/core';
import startCase from 'lodash/startCase';
import React, { useState } from 'react';
import { ProductQuery, StockStatusEnum, useAddToCartMutation } from '../../graphql';
import Stock from './Stock';

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const AddToCart: React.VFC<Props> = ({ product }) => {
  const { addAlert } = useUI();

  const [showViewCart, setShowViewCart] = useState(false);
  const [variationId, setVariationId] = useState<number>();

  const [addToCart, { loading }] = useAddToCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  /** Handles adding items to the cart. */
  const handleAddToCartClick = async () => {
    try {
      await addToCart({
        variables: {
          productId: product.databaseId,
          variationId,
        },
      });
      // Show View Cart Button
      setShowViewCart(true);
    } catch (error) {
      if (isApolloError(error)) {
        addAlert(error.message, { severity: 'error' });
      }
    }
  };

  /** Handles changing the variation. */
  const handleVariationChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setVariationId(ev.target.value !== '' ? parseInt(ev.target.value, 10) : undefined);
  };

  const viewCart = showViewCart && (
    <Button color="secondary" href="/cart">
      View cart
    </Button>
  );

  return product.__typename === 'ExternalProduct' ? (
    <Button
      color="primary"
      variant="contained"
      href={product.externalUrl ?? '/'}
      target="_blank"
      rel="noopener noreferrer"
    >
      Buy now
    </Button>
  ) : product.__typename === 'SimpleProduct' ? (
    <>
      <Stock product={product} />
      <Stack direction="row" spacing={1}>
        <Button
          color="primary"
          variant="contained"
          disabled={product.stockStatus === StockStatusEnum.OUT_OF_STOCK}
          loading={loading}
          onClick={handleAddToCartClick}
        >
          Add to cart
        </Button>
        {viewCart}
      </Stack>
    </>
  ) : product.__typename === 'VariableProduct' ? (
    <>
      <TextField
        select
        margin="normal"
        label={startCase(
          product.variations?.nodes?.[0]?.attributes?.nodes?.[0]?.name?.replace(/^pa_/, '') ??
            'Variation',
        )}
        name="variation"
        SelectProps={{
          native: true,
        }}
        onChange={handleVariationChange}
      >
        <option value="">Select a variation...</option>
        {product.variations?.nodes?.map((variation) =>
          variation?.attributes?.nodes?.map(
            (attribute) =>
              attribute?.value != null &&
              variation.databaseId != null && (
                <option
                  key={variation.id}
                  disabled={variation.stockStatus === StockStatusEnum.OUT_OF_STOCK}
                  value={variation.databaseId}
                >
                  {attribute.value}
                  {variation.stockStatus === StockStatusEnum.OUT_OF_STOCK && ' (Sold out)'}
                </option>
              ),
          ),
        )}
      </TextField>
      <Box sx={{ mt: 1 }}>
        <Stock
          product={product}
          variation={product.variations?.nodes?.find(
            (variation) => variation?.databaseId === variationId,
          )}
        />
      </Box>
      <Stack direction="row" spacing={1}>
        <Button
          color="primary"
          variant="contained"
          disabled={!variationId}
          loading={loading}
          onClick={handleAddToCartClick}
        >
          Add to cart
        </Button>
        {viewCart}
      </Stack>
    </>
  ) : null;
};

export default AddToCart;
