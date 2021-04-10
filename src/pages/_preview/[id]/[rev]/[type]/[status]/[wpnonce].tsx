import { BlockRenderer, Layout } from '@components/core';
import { Container } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { usePreviewQuery } from '../../../../../../graphql';

const Preview: NextPage = () => {
  const router = useRouter();

  const { data: { page } = { page: undefined } } = usePreviewQuery({
    ssr: false,
    variables: {
      id: `${router.query.id}`,
      rev: parseInt(`${router.query.rev}`, 10),
    },
  });

  return (
    <Layout>
      <Container>
        <BlockRenderer>{page?.revisions?.nodes?.[0]?.content}</BlockRenderer>
      </Container>
    </Layout>
  );
};

export default Preview;
