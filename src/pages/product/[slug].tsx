import { Box, Container, Grid, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Loader from '../../components/global/loader';
import PageWrapper from '../../components/global/page-wrapper';
import ProductGrid from '../../components/global/product-grid';
import RichText from '../../components/global/rich-text';
import ProductAddToCart from '../../components/product/product-add-to-cart';
import ProductAttributes from '../../components/product/product-attributes';
import ProductGallery from '../../components/product/product-gallery';
import ProductJSON from '../../components/product/product-json';
import ProductMeta from '../../components/product/product-meta';
import ProductSummary from '../../components/product/product-summary';
import { useProductQuery } from '../../graphql';
import isBlank from '../../utils/is-blank';

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
    <PageWrapper>
      {loading ? (
        <Loader full />
      ) : (
        <>
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
          <ProductJSON product={product} />
          {product != null && (
            <Container>
              <Box my={6} overflow="hidden">
                <Grid container spacing={6}>
                  <Grid item xs={12} md={6}>
                    <ProductGallery product={product} />
                  </Grid>
                  <Grid item xs={12} md={6}>
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
        </>
      )}
    </PageWrapper>
  );
};

export default Product;
