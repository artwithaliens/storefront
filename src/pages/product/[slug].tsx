import { Layout, ProductGrid, RichText } from '@components/core';
import {
  AddToCart,
  ProductAttributes,
  ProductGallery,
  ProductJSON,
  ProductMeta,
  ProductSummary,
} from '@components/product';
import { Loader } from '@components/ui';
import { Box, Container, Grid, Typography } from '@material-ui/core';
import isBlank from '@utils/isBlank';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { useProductQuery } from '../../graphql';

const Product: NextPage = () => {
  const router = useRouter();

  const { data: { product } = { product: undefined }, loading } = useProductQuery({
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
      {loading || product == null ? (
        <Loader fullHeight />
      ) : (
        <>
          <NextSeo
            title={product.seo?.title ?? undefined}
            description={product.seo?.metaDesc ?? undefined}
            openGraph={{
              title: product.seo?.opengraphTitle ?? undefined,
              description: product.seo?.opengraphDescription ?? undefined,
              type: 'product',
              images:
                product.seo?.opengraphImage?.sourceUrl != null
                  ? [
                      {
                        url: product.seo.opengraphImage.sourceUrl,
                        alt: product.seo.opengraphImage.altText ?? undefined,
                        width: product.seo.opengraphImage.mediaDetails?.width ?? undefined,
                        height: product.seo.opengraphImage.mediaDetails?.height ?? undefined,
                      },
                    ]
                  : undefined,
            }}
          />
          <ProductJSON product={product} />
          <Container>
            <Box sx={{ my: 6, overflow: { xs: 'hidden', md: 'inherit' } }}>
              <Grid container spacing={6}>
                <Grid item xs={12} md={6}>
                  <ProductGallery product={product} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ position: 'sticky', top: 48 }}>
                    <ProductSummary product={product} />
                    <AddToCart product={product} />
                    <ProductMeta product={product} />
                  </Box>
                </Grid>
              </Grid>
              {!isBlank(product.shortDescription) && !isBlank(product.description) && (
                <Box sx={{ mt: 6 }}>
                  <Typography gutterBottom variant="h3">
                    Description
                  </Typography>
                  <RichText>{product.description}</RichText>
                </Box>
              )}
              <ProductAttributes product={product} />
            </Box>
            {(product.related?.nodes?.length ?? 0) > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography gutterBottom variant="h3">
                  Related products
                </Typography>
                <ProductGrid products={product.related?.nodes ?? []} />
              </Box>
            )}
          </Container>
        </>
      )}
    </Layout>
  );
};

export default Product;
