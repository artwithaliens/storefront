import { Layout } from '@components/core';
import { Home } from '@components/icons';
import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useCustomerQuery } from '../graphql';

const useStyles = makeStyles({
  container: {
    position: 'relative',
  },

  sidebar: {
    backgroundColor: '#f8f8f8',
    height: 'auto',
    left: 0,
    maxHeight: 400,
    overflowX: 'hidden',
    paddingTop: 16,
    position: 'absolute',
    top: 0,
    width: 180,
    zIndex: 1,
  },

  sidebarLink: {
    color: '#818181',
    display: 'block',
    fontSize: 16,
    opacity: 1,
    padding: '6px 8px 6px 16px',
    textDecoration: 'none',
    transition: 'opacity 0.3s ease',

    '&:hover': {
      opacity: 0.8,
    },
  },

  main: {
    marginLeft: 180,
  },
});

const MyAccount: NextPage = () => {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const styles = useStyles();
  const { data: { customer } = { customer: undefined } } = useCustomerQuery({ ssr: false });

  useEffect(() => {
    if (customer?.username != null) {
      setShowContent(true);
    } else {
      // If user is not logged in send the user back to login page.
      // router.push('/login');
    }
  }, [customer, router]);

  return (
    <Layout>
      {/* Only Show Content if user is logged in */}
      {showContent && (
        <Container className={styles.container}>
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4">My Account</Typography>
            <div className={styles.sidebar}>
              <a className={styles.sidebarLink} href="#dashboard">
                <Home />
                <span>Dashboard</span>
              </a>
              <a className={styles.sidebarLink} href="#orders">
                <span>Orders</span>
              </a>
              <a className={styles.sidebarLink} href="#addresses">
                <span>Addresses</span>
              </a>
              <a className={styles.sidebarLink} href="#account-details">
                <span>Account Details</span>
              </a>
            </div>
            <div className={styles.main}>
              <div id="dashboard">
                <Typography gutterBottom variant="h6">
                  Howdy {customer?.username}!
                </Typography>
                <Typography variant="h5">Account Details</Typography>
                <p>Email: {customer?.billing?.email}</p>
              </div>
            </div>
          </Box>
        </Container>
      )}
    </Layout>
  );
};

export default MyAccount;
