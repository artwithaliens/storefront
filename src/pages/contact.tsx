import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import ContactForm from '../components/core/contact-form';
import PageHeader from '../components/core/page-header';
import PageWrapper from '../components/core/page-wrapper';
import { Pin } from '../components/icons';

const Contact: NextPage = () => (
  <PageWrapper>
    <PageHeader title="Contact" />
    <Container maxWidth="md">
      <Box sx={{ my: 6 }}>
        <ContactForm />
      </Box>
    </Container>
    <Box sx={{ position: 'relative' }}>
      <Pin
        style={{
          fill: '#af8245',
          height: 48,
          left: 'calc(50% + 4px)',
          position: 'absolute',
          top: 'calc(50% - 16px)',
          width: 48,
          zIndex: 1,
        }}
      />
      <img
        src="/berlin.png"
        alt="Art With Aliens"
        style={{
          height: 500,
          width: '100%',
          objectFit: 'cover',
          opacity: 0.5,
          verticalAlign: 'middle',
        }}
      />
    </Box>
  </PageWrapper>
);

export default Contact;
