import { makeStyles } from '@material-ui/core';
import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

const useStyles = makeStyles(
  {
    content: {
      display: 'flex',
      flexDirection: 'column',
    },
  },
  { name: 'Layout' },
);

const Layout: React.FC = ({ children }) => {
  const styles = useStyles();

  return (
    <>
      <Header />
      <div className={styles.content}>{children}</div>
      <Footer />
    </>
  );
};

export default Layout;
