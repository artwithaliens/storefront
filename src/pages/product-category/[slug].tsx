import { PageWrapper, ProductGrid } from '@components/core';
import { Loader } from '@components/ui';
import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useProductsQuery } from '../../graphql';

const ProductCategory: NextPage = () => {
  const router = useRouter();

  const { data: { products } = { products: undefined }, loading } = useProductsQuery({
    variables: {
      category: `${router.query.slug}`,
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

export default ProductCategory;
