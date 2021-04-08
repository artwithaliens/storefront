import { BlockRenderer, CategoryGrid, PageWrapper } from '@components/core';
import { Hero } from '@components/ui';
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
      <Hero
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
