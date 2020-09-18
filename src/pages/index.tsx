import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import BlockRenderer from '../components/global/block-renderer';
import PageHeader from '../components/global/page-header';
import PageWrapper from '../components/global/page-wrapper';
import Categories from '../components/index/categories';
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
