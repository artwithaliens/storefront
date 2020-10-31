import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import BlockRenderer from '../components/core/block-renderer';
import Categories from '../components/core/categories';
import PageHeader from '../components/core/page-header';
import PageWrapper from '../components/core/page-wrapper';
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
      <Categories />
    </PageWrapper>
  );
};

export default Index;
