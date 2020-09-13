import { ApolloError } from '@apollo/client';
import { Box, makeStyles, TextField } from '@material-ui/core';
import startCase from 'lodash/startCase';
import React, { useContext, useState } from 'react';
import { ProductQuery, StockStatusEnum, useAddToCartMutation } from '../../graphql';
import { AlertContext } from '../AlertProvider';
import Button from '../Button';

const useStyles = makeStyles(
  ({ spacing }) => ({
    viewCartButton: {
      marginLeft: spacing(1),
    },
  }),
  { name: 'AddToCart' },
);

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductAddToCart: React.FC<Props> = ({ product }) => {
  const styles = useStyles();
  const { addAlert } = useContext(AlertContext);

  const [showViewCart, setShowViewCart] = useState(false);
  const [variationId, setVariationId] = useState<number>();

  const [addToCart, { loading }] = useAddToCartMutation({
    refetchQueries: ['Cart'],
    awaitRefetchQueries: true,
  });

  /** Handles adding items to the cart. */
  const handleAddToCartClick = () => {
    if (product.productId != null) {
      addToCart({
        variables: {
          productId: product.productId,
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
    <Button href="/cart" className={styles.viewCartButton}>
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
              variation?.variationId != null && (
                <option key={variation.id} value={variation.variationId}>
                  {attribute.value}
                </option>
              ),
          ),
        )}
      </TextField>
      <Box mt={2}>
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
