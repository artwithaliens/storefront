import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { ProductsQuery, StockStatusEnum } from '../graphql';
import Link from './Link';
import Price from './Price';

const useStyles = makeStyles(
  ({ palette, spacing }) => ({
    product: {
      height: '100%',
      textAlign: 'center',
    },

    productLink: {
      color: palette.common.white,
      cursor: 'pointer',
      display: 'block',
      height: '100%',
      textDecoration: 'none',
    },

    productImage: {
      maxWidth: '100%',
      verticalAlign: 'middle',
    },

    productName: {
      margin: spacing(2),
    },

    productPrice: {
      margin: spacing(0, 0, 2),
    },
  }),
  { name: 'ProductGrid' },
);

type Props = {
  products: NonNullable<NonNullable<ProductsQuery['products']>['nodes']>;
};

const ProductGrid: React.FC<Props> = ({ products }) => {
  const styles = useStyles();

  if (products.length === 0) {
    return <Typography>No products found.</Typography>;
  }

  return (
    <Grid container spacing={4}>
      {products.map(
        (product) =>
          product != null && (
            <Grid key={product.id} item xs={6} md={3}>
              <Paper className={styles.product}>
                <Link
                  className={styles.productLink}
                  href="/product/[slug]"
                  as={`/product/${product.slug}`}
                  underline="none"
                >
                  <img
                    className={styles.productImage}
                    src={product.image?.sourceUrl ?? undefined}
                    srcSet={product.image?.srcSet ?? undefined}
                    alt={product.image?.altText ?? ''}
                  />
                  <Typography variant="h4" className={styles.productName}>
                    {product.name}
                  </Typography>
                  <div className={styles.productPrice}>
                    {product.__typename === 'SimpleProduct' &&
                      (product.stockStatus === StockStatusEnum.OUT_OF_STOCK ? (
                        <Typography color="error" variant="h5">
                          Sold out
                        </Typography>
                      ) : (
                        <Price color="primary" variant="h5">
                          {product.price}
                        </Price>
                      ))}
                    {(product.__typename === 'VariableProduct' ||
                      product.__typename === 'ExternalProduct') && (
                      <Price color="primary" variant="h5">
                        {product.price}
                      </Price>
                    )}
                  </div>
                </Link>
              </Paper>
            </Grid>
          ),
      )}
    </Grid>
  );
};

export default ProductGrid;
