import { LoginView } from '@components/auth';
import { Footer, Header } from '@components/core';
import { Dialog, Loader } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Alert, Box, Snackbar } from '@material-ui/core';
import dynamic from 'next/dynamic';
import React from 'react';

const CookieBanner = dynamic(() => import('@components/core/CookieBanner'), {
  loading: () => <Loader />,
});

const Layout: React.FC = ({ children }) => {
  const { alerts, closeModal, displayModal, modalView, removeAlert } = useUI();

  return (
    <>
      <Header />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>{children}</Box>
      <Footer />
      <CookieBanner />
      <Dialog open={displayModal} onClose={closeModal}>
        <>{modalView === 'LOGIN_VIEW' && <LoginView />}</>
      </Dialog>
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          autoHideDuration={5000}
          open={alert.open}
          onClose={() => removeAlert(alert.id)}
        >
          <Alert {...alert.props} onClose={() => removeAlert(alert.id)}>
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default Layout;
