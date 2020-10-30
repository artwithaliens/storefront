import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Loader from '../../components/global/loader';
import PageWrapper from '../../components/global/page-wrapper';
import ProductGrid from '../../components/global/product-grid';
import { useProductsQuery } from '../../graphql';

const ProductTag: NextPage = () => {
  const router = useRouter();

  const { data: { products } = { products: undefined }, loading } = useProductsQuery({
    variables: {
      tag: `${router.query.slug}`,
    },
  });

  return (
    <PageWrapper>
      {loading ? (
        <Loader fullHeight />
      ) : (
        <Container>
          <Box sx={{ mt: 6 }}>
            <ProductGrid products={products?.nodes ?? []} />
          </Box>
        </Container>
      )}
    </PageWrapper>
  );
};

export default ProductTag;
