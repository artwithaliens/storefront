import { Image } from '@components/core';
import { ColorSwatch, Link, Price } from '@components/ui';
import { Box, Grid, Paper, Skeleton, Stack, Typography } from '@material-ui/core';
import rangeMap from '@utils/rangeMap';
import React from 'react';
import { ProductsQuery, StockStatusEnum } from '../../../graphql';

type Props = {
  loading?: boolean;
  products: NonNullable<NonNullable<ProductsQuery['products']>['nodes']>;
};

const ProductGrid: React.VFC<Props> = ({ loading, products }) => {
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
                  <Paper sx={{ height: '100%', textAlign: 'center' }}>
                    <Link
                      href={`/product/${product.slug}`}
                      underline="none"
                      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <Image height={673} loading="lazy" mediaItem={product.image} width={538} />
                      <Box sx={{ p: 2 }}>
                        {product.__typename === 'VariableProduct' && (
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ justifyContent: 'center', mb: 2 }}
                          >
                            {product.paColors?.nodes?.map(
                              (color) =>
                                color?.name != null && (
                                  <ColorSwatch key={color.id} color={color.name} size="small" />
                                ),
                            )}
                          </Stack>
                        )}
                        <Typography gutterBottom variant="h4">
                          {product.name}
                        </Typography>
                        {(product.__typename === 'SimpleProduct' ||
                          product.__typename === 'VariableProduct') &&
                          (product.stockStatus === StockStatusEnum.OUT_OF_STOCK ? (
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
