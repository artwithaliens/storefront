import { Box, Container, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import { first } from 'lodash';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Layout from '../../components/Layout';
import Link from '../../components/Link';
import Price from '../../components/Price';
import ProductAddToCart from '../../components/ProductAddToCart';
import ProductAttributes from '../../components/ProductAttributes';
import ProductGallery from '../../components/ProductGallery';
import ProductGalleryStepper from '../../components/ProductGalleryStepper';
import ProductGrid from '../../components/ProductGrid';
import ProductMeta from '../../components/ProductMeta';
import RichText from '../../components/RichText';
import { StockStatusEnum, useProductQuery } from '../../graphql';
import isBlank from '../../utils/isBlank';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  container: {
    paddingBottom: spacing(1),

    [breakpoints.down('sm')]: {
      overflow: 'hidden',
    },
  },

  description: {
    position: 'sticky',
    top: 48,
  },

  meta: {
    marginTop: 16,
  },
}));

const Product: NextPage = () => {
  const styles = useStyles();
  const router = useRouter();

  const { data: { product } = { product: undefined } } = useProductQuery({
    variables: {
      slug: `${router.query.slug}`,
    },
  });

  useEffect(() => {
    if (product != null) {
      ReactGA.plugin.execute('ec', 'addProduct', {
        id: product.id,
        name: product.name,
        category: first(product.productCategories?.nodes)?.name,
        price:
          (product.__typename === 'SimpleProduct' ||
            product.__typename === 'VariableProduct' ||
            product.__typename === 'ExternalProduct') &&
          product.price != null
            ? parseFloat(product.price)
            : undefined,
      });
      ReactGA.plugin.execute('ec', 'setAction', 'detail');
    }
  }, [product]);

  return (
    <Layout>
      <NextSeo
        title={product?.seo?.title ?? undefined}
        description={product?.seo?.description ?? undefined}
        openGraph={{
          title: product?.seo?.openGraphTitle ?? undefined,
          description: product?.seo?.openGraphDescription ?? undefined,
          type: 'product',
          images:
            product?.seo?.socialImage?.sourceUrl != null
              ? [
                  {
                    url: product.seo.socialImage.sourceUrl,
                    alt: product.seo.socialImage.altText ?? undefined,
                    width: product.seo.socialImage.mediaDetails?.width ?? undefined,
                    height: product.seo.socialImage.mediaDetails?.height ?? undefined,
                  },
                ]
              : undefined,
        }}
      />
      {product != null && (
        <Container className={styles.container}>
          <Box my={6}>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <Hidden mdUp>
                  <ProductGalleryStepper product={product} />
                </Hidden>
                <Hidden smDown>
                  <ProductGallery product={product} />
                </Hidden>
              </Grid>
              <Grid item md={6}>
                <div className={styles.description}>
                  <Typography component="h1" variant="h2">
                    {product.name}
                  </Typography>
                  {(product.__typename === 'SimpleProduct' ||
                    product.__typename === 'VariableProduct' ||
                    product.__typename === 'ExternalProduct') && (
                    <Price color="primary" variant="h3">
                      {product.price}
                    </Price>
                  )}
                  <Typography gutterBottom variant="body2">
                    plus{' '}
                    <Link href="/[slug]" as="/shipping-costs">
                      Shipping Costs
                    </Link>
                  </Typography>
                  <RichText>
                    {isBlank(product.shortDescription)
                      ? product.description
                      : product.shortDescription}
                  </RichText>
                  {product.__typename === 'SimpleProduct' &&
                  product.stockStatus === StockStatusEnum.OUT_OF_STOCK ? (
                    <Typography gutterBottom color="error" variant="h5">
                      Sold out
                    </Typography>
                  ) : (
                    <Typography gutterBottom variant="body2">
                      Deliverable in{' '}
                      {isBlank(product.deliveryTime) ? '2-3 working days' : product.deliveryTime}
                    </Typography>
                  )}
                  <ProductAddToCart product={product} />
                  <ProductMeta product={product} />
                </div>
              </Grid>
            </Grid>
            {!isBlank(product.shortDescription) && !isBlank(product.description) && (
              <Box mt={6}>
                <Typography gutterBottom variant="h3">
                  Description
                </Typography>
                <RichText>{product.description}</RichText>
              </Box>
            )}
            <ProductAttributes product={product} />
          </Box>
          {(product.related?.nodes?.length ?? 0) > 0 && (
            <Box mb={6}>
              <Typography gutterBottom variant="h3">
                Related products
              </Typography>
              <ProductGrid products={product.related?.nodes ?? []} />
            </Box>
          )}
        </Container>
      )}
    </Layout>
  );
};

export default Product;
