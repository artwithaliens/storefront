import { BlockRenderer, CategoryGrid, PageHeader, PageWrapper } from '@components/core';
import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { usePageQuery } from '../graphql';

const Index: NextPage = () => {
  const { data: { page } = { page: undefined } } = usePageQuery({
    variables: {
      slug: 'home',
    },
  });

  return (
    <PageWrapper>
      <PageHeader
        fullHeight
        image={{
          sourceUrl: '/home.jpg',
          srcSet: '/home@2x.jpg 2x',
        }}
      />
      <Container>
        <BlockRenderer>{page?.content}</BlockRenderer>
      </Container>
      <CategoryGrid />
    </PageWrapper>
  );
};

export default Index;
