import { Box, Container, Grid, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Layout from '../../components/Layout';
import ProductAddToCart from '../../components/ProductAddToCart';
import ProductAttributes from '../../components/ProductAttributes';
import ProductGallery from '../../components/ProductGallery';
import ProductGrid from '../../components/ProductGrid';
import ProductMeta from '../../components/ProductMeta';
import ProductSummary from '../../components/ProductSummary';
import RichText from '../../components/RichText';
import { useProductQuery } from '../../graphql';
import isBlank from '../../utils/isBlank';

const Product: NextPage = () => {
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
        category: product.productCategories?.nodes?.[0]?.name,
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
        <Container>
          <Box my={6}>
            <Grid container spacing={6}>
              <Grid item md={6}>
                <ProductGallery product={product} />
              </Grid>
              <Grid item md={6}>
                <Box position="sticky" top={48}>
                  <ProductSummary product={product} />
                  <ProductAddToCart product={product} />
                  <ProductMeta product={product} />
                </Box>
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
