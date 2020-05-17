import { Box, Container, makeStyles, SvgIcon, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/AuthProvider';
import Layout from '../components/Layout';
import HomeSvg from '../icons/home.svg';

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
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (userData) {
      setShowContent(true);
    } else {
      // If user is not logged in send the user back to login page.
      router.push('/login');
    }
  }, [router, userData]);

  return (
    <Layout>
      {/* Only Show Content if user is logged in */}
      {showContent && (
        <Container className={styles.container}>
          <Box mt={6}>
            <Typography variant="h4">My Account</Typography>
            <div className={styles.sidebar}>
              <a className={styles.sidebarLink} href="#dashboard">
                <SvgIcon component={HomeSvg} />
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
                  Howdy {userData?.user?.nicename}!
                </Typography>
                <Typography variant="h5">Account Details</Typography>
                <p>Email: {userData?.user?.email}</p>
              </div>
            </div>
          </Box>
        </Container>
      )}
    </Layout>
  );
};

export default MyAccount;
