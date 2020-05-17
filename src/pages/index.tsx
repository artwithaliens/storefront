import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import BlockRenderer from '../components/BlockRenderer';
import Categories from '../components/Categories';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
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
          sourceUrl: '/home.png',
          srcSet: '/home@2x.png 2x',
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
