import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/global/layout';
import Loader from '../components/global/loader';
import ProductGrid from '../components/global/product-grid';
import { useProductsQuery } from '../graphql';

const Shop: NextPage = () => {
  const { data: { products } = { products: undefined }, loading } = useProductsQuery();

  return (
    <Layout>
      {loading ? (
        <Loader full />
      ) : (
        <Container>
          <Box my={6}>
            <ProductGrid products={products?.nodes ?? []} />
          </Box>
        </Container>
      )}
    </Layout>
  );
};

export default Shop;
