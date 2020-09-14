import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import BlockRenderer from '../components/global/block-renderer';
import Layout from '../components/global/layout';
import PageHeader from '../components/global/page-header';
import Categories from '../components/index/categories';
import { usePageQuery } from '../graphql';

const Index: NextPage = () => {
  const { data: { page } = { page: undefined } } = usePageQuery({
    variables: {
      slug: 'home',
    },
  });

  return (
    <Layout>
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
    </Layout>
  );
};

export default Index;
