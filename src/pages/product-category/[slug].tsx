import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import PageWrapper from '../../components/global/page-wrapper';
import ProductGrid from '../../components/global/product-grid';
import { useProductsQuery } from '../../graphql';

const ProductCategory: NextPage = () => {
  const router = useRouter();

  const { data: { products } = { products: undefined } } = useProductsQuery({
    variables: {
      category: `${router.query.slug}`,
    },
  });

  return (
    <PageWrapper>
      <Container>
        <Box mt={6}>
          <ProductGrid products={products?.nodes ?? []} />
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default ProductCategory;
