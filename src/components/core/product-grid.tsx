import { Image, Price } from '@components/core';
import { Link } from '@components/ui';
import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { ProductsQuery, StockStatusEnum } from '../../graphql';

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
  products: NonNullable<NonNullable<ProductsQuery['products']>['nodes']>;
};

const ProductGrid: React.VFC<Props> = ({ products }) => {
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
                  href={`/product/${product.slug}`}
                  underline="none"
                >
                  <Image next height={673} loading="lazy" mediaItem={product.image} width={538} />
                  <Box sx={{ p: 2 }}>
                    <Typography gutterBottom variant="h4">
                      {product.name}
                    </Typography>
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
