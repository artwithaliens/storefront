import { getDataFromTree } from '@apollo/react-ssr';
import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import BlockRenderer from '../components/BlockRenderer';
import Layout from '../components/Layout';
import { usePageQuery } from '../graphql';
import withApollo from '../withApollo';

const Index: NextPage = () => {
  const { data: { page } = { page: undefined } } = usePageQuery({
    variables: {
      slug: 'home',
    },
  });

  return (
    <Layout>
      <Container>
        <BlockRenderer>{page?.content}</BlockRenderer>
      </Container>
    </Layout>
  );
};

export default withApollo(Index, { getDataFromTree });
