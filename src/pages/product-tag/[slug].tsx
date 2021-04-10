import { Layout, ProductGrid } from '@components/core';
import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useProductsQuery } from '../../graphql';

const ProductTag: NextPage = () => {
  const router = useRouter();

  const { data: { products } = { products: undefined }, loading } = useProductsQuery({
    variables: {
      tag: `${router.query.slug}`,
    },
  });

  return (
    <Layout>
      <Container>
        <Box sx={{ my: 6 }}>
          <ProductGrid loading={loading} products={products?.nodes ?? []} />
        </Box>
      </Container>
    </Layout>
  );
};

export default ProductTag;
