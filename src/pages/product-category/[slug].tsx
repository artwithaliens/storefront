import { getDataFromTree } from '@apollo/react-ssr';
import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import ProductGrid from '../../components/ProductGrid';
import { useProductsQuery } from '../../graphql';
import withApollo from '../../withApollo';

const ProductCategory: NextPage = () => {
  const router = useRouter();

  const { data: { products } = { products: undefined } } = useProductsQuery({
    variables: {
      category: `${router.query.slug}`,
    },
  });

  return (
    <Layout>
      <Container>
        <Box mt={6}>
          <ProductGrid products={products?.nodes ?? []} />
        </Box>
      </Container>
    </Layout>
  );
};

export default withApollo(ProductCategory, { getDataFromTree });
