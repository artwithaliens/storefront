import { ApolloError } from '@apollo/client';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Box, makeStyles, TextField } from '@material-ui/core';
import startCase from 'lodash/startCase';
import React, { useState } from 'react';
import { ProductQuery, StockStatusEnum, useAddToCartMutation } from '../../graphql';

const useStyles = makeStyles(
  ({ spacing }) => ({
    viewCartButton: {
      marginLeft: spacing(1),
    },
  }),
  { name: 'ProductAddToCart' },
);

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductAddToCart: React.VFC<Props> = ({ product }) => {
  const styles = useStyles();
  const { addAlert } = useUI();

  const [showViewCart, setShowViewCart] = useState(false);
  const [variationId, setVariationId] = useState<number>();

  const [addToCart, { loading }] = useAddToCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  /** Handles adding items to the cart. */
  const handleAddToCartClick = () => {
    if (product.databaseId != null) {
      addToCart({
        variables: {
          productId: product.databaseId,
          variationId,
        },
      })
        .then(() => {
          // Show View Cart Button
          setShowViewCart(true);
        })
        .catch((error: ApolloError) => {
          addAlert(error.message, { severity: 'error' });
        });
    }
  };

  /** Handles changing the variation. */
  const handleVariationChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value !== '') {
      setVariationId(parseInt(ev.target.value, 10));
    }
  };

  const viewCart = showViewCart && (
    <Button color="secondary" href="/cart" className={styles.viewCartButton}>
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
      <Button
        color="primary"
        variant="contained"
        disabled={product.stockStatus !== StockStatusEnum.IN_STOCK}
        loading={loading}
        onClick={handleAddToCartClick}
      >
        Add to cart
      </Button>
      {viewCart}
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
              variation?.databaseId != null && (
                <option key={variation.id} value={variation.databaseId}>
                  {attribute.value}
                </option>
              ),
          ),
        )}
      </TextField>
      <Box sx={{ mt: 2 }}>
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
      </Box>
    </>
  ) : null;
};

export default ProductAddToCart;
