import { LoginView } from '@components/auth';
import { CookieBanner, Footer, Header } from '@components/core';
import { Dialog } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Alert, Box, Snackbar } from '@material-ui/core';
import React from 'react';

const PageWrapper: React.FC = ({ children }) => {
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

export default PageWrapper;
