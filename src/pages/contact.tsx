import { Box, Container } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import PinSvg from '../assets/icons/pin.svg';
import ContactForm from '../components/contact/contact-form';
import PageHeader from '../components/global/page-header';
import PageWrapper from '../components/global/page-wrapper';

const Contact: NextPage = () => (
  <PageWrapper>
    <PageHeader title="Contact" />
    <Container maxWidth="md">
      <Box sx={{ my: 6 }}>
        <ContactForm />
      </Box>
    </Container>
    <div style={{ position: 'relative' }}>
      <PinSvg
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
    </div>
  </PageWrapper>
);

export default Contact;
