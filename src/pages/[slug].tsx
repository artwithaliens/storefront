import { Box, Container } from '@material-ui/core';
import { ApolloPageContext } from '@sotnikov/next-with-apollo';
import { NextPage } from 'next';
import { NextSeo } from 'next-seo';
import Error from 'next/error';
import React from 'react';
import BlockRenderer from '../components/global/block-renderer';
import PageHeader from '../components/global/page-header';
import PageWrapper from '../components/global/page-wrapper';
import { PageDocument, PageQuery, PageQueryVariables } from '../graphql';

type Props = {
  page: PageQuery['page'];
};

const Page: NextPage<Props> = ({ page }) => {
  if (page == null) {
    return <Error statusCode={404} />;
  }
  return (
    <PageWrapper>
      <NextSeo
        title={page.seo?.title ?? ''}
        description={page.seo?.description ?? ''}
        openGraph={{
          title: page.seo?.openGraphTitle ?? '',
          description: page.seo?.openGraphDescription ?? '',
        }}
      />
      <PageHeader image={page.featuredImage?.node} title={page.title} />
      <Container>
        <Box mt={4}>
          <BlockRenderer>{page.content}</BlockRenderer>
        </Box>
      </Container>
    </PageWrapper>
  );
};

Page.getInitialProps = async (context: ApolloPageContext) => {
  const page = await context.apolloClient
    .query<PageQuery, PageQueryVariables>({
      query: PageDocument,
      variables: {
        slug: `${context.query.slug}`,
      },
    })
    .then(({ data }) => {
      if (context.res != null && data?.page == null) {
        context.res.statusCode = 404;
      }
      return data?.page;
    });
  return { page };
};

export default Page;
