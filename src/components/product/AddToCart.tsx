import { isApolloError } from '@apollo/client';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Box, Stack } from '@material-ui/core';
import React, { useState } from 'react';
import { PartialDeep } from 'type-fest';
import {
  ProductQuery,
  ProductVariation,
  StockStatusEnum,
  useAddToCartMutation,
} from '../../graphql';
import Stock from './Stock';
import VariationForm from './VariationForm';

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
  const handleVariationChange = (variation?: PartialDeep<ProductVariation>) => {
    setVariationId(variation?.databaseId);
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
      <VariationForm product={product} onChange={handleVariationChange} />
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
