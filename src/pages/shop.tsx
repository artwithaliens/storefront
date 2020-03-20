import { getDataFromTree } from '@apollo/react-ssr';
import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import ProductGrid from '../components/ProductGrid';
import { useProductsQuery } from '../graphql';
import withApollo from '../withApollo';

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

export default withApollo(Shop, { getDataFromTree });
