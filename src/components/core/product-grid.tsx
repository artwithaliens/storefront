import { Image, Price } from '@components/core';
import { Link } from '@components/ui';
import { Box, Grid, makeStyles, Paper, Skeleton, Typography } from '@material-ui/core';
import React from 'react';
import { ProductsQuery } from '../../graphql';
import isProductOutOfStock from '../../utils/is-product-out-of-stock';
import rangeMap from '../../utils/range-map';

const useStyles = makeStyles(
  {
    product: {
      height: '100%',
      textAlign: 'center',
    },

    productLink: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
  },
  { name: 'ProductGrid' },
);

type Props = {
  loading?: boolean;
  products: NonNullable<NonNullable<ProductsQuery['products']>['nodes']>;
};

const ProductGrid: React.VFC<Props> = ({ loading, products }) => {
  const styles = useStyles();

  if (!loading && products.length === 0) {
    return <Typography>No products found.</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {loading
        ? rangeMap(12, (i) => (
            <Grid key={i} item xs={6} md={3}>
              <Skeleton variant="rectangular" height={375} />
            </Grid>
          ))
        : products.map(
            (product) =>
              product != null && (
                <Grid key={product.id} item xs={6} md={3}>
                  <Paper className={styles.product}>
                    <Link
                      className={styles.productLink}
                      href={`/product/${product.slug}`}
                      underline="none"
                    >
                      <Image height={673} loading="lazy" mediaItem={product.image} width={538} />
                      <Box sx={{ p: 2 }}>
                        <Typography gutterBottom variant="h4">
                          {product.name}
                        </Typography>
                        {(product.__typename === 'SimpleProduct' ||
                          product.__typename === 'VariableProduct') &&
                          (isProductOutOfStock(product) ? (
                            <Typography color="error" variant="h5">
                              Out of stock
                            </Typography>
                          ) : (
                            <Price color="primary" variant="h5">
                              {product.price}
                            </Price>
                          ))}
                        {product.__typename === 'ExternalProduct' && (
                          <Price color="primary" variant="h5">
                            {product.price}
                          </Price>
                        )}
                      </Box>
                    </Link>
                  </Paper>
                </Grid>
              ),
          )}
    </Grid>
  );
};

export default ProductGrid;
