import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Loader from '../components/global/loader';
import PageWrapper from '../components/global/page-wrapper';
import ProductGrid from '../components/global/product-grid';
import { useProductsQuery } from '../graphql';

const Shop: NextPage = () => {
  const { data: { products } = { products: undefined }, loading } = useProductsQuery();

  return (
    <PageWrapper>
      {loading ? (
        <Loader full />
      ) : (
        <Container>
          <Box my={6}>
            <ProductGrid products={products?.nodes ?? []} />
          </Box>
        </Container>
      )}
    </PageWrapper>
  );
};

export default Shop;
