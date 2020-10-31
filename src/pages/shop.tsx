import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import PageWrapper from '../components/core/page-wrapper';
import ProductGrid from '../components/core/product-grid';
import { Loader } from '../components/ui';
import { useProductsQuery } from '../graphql';

const Shop: NextPage = () => {
  const { data: { products } = { products: undefined }, loading } = useProductsQuery();

  return (
    <PageWrapper>
      {loading ? (
        <Loader fullHeight />
      ) : (
        <Container>
          <Box sx={{ my: 6 }}>
            <ProductGrid products={products?.nodes ?? []} />
          </Box>
        </Container>
      )}
    </PageWrapper>
  );
};

export default Shop;
