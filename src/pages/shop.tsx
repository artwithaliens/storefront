import { PageWrapper, ProductGrid } from '@components/core';
import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { useProductsQuery } from '../graphql';

const Shop: NextPage = () => {
  const { data: { products } = { products: undefined }, loading } = useProductsQuery();

  return (
    <PageWrapper>
      <Container>
        <Box sx={{ my: 6 }}>
          <ProductGrid loading={loading} products={products?.nodes ?? []} />
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default Shop;
