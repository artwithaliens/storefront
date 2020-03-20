import { Snackbar } from '@material-ui/core';
import { Alert, AlertProps } from '@material-ui/lab';
import { uniqueId } from 'lodash';
import React, { useState } from 'react';

export const AppContext = React.createContext<{
  addAlert: (message: string, props?: Partial<AlertProps>) => void;
  alerts: { id: string; message: string; open: boolean; props?: Partial<AlertProps> }[];
  removeAlert: (id: string) => void;
}>({
  addAlert: () => {},
  alerts: [],
  removeAlert: () => {},
});

const AppProvider: React.FC = ({ children }) => {
  const [alerts, setAlerts] = useState<
    { id: string; message: string; open: boolean; props?: Partial<AlertProps> }[]
  >([]);

  const addAlert = (message: string, props?: Partial<AlertProps>) => {
    setAlerts((prevAlerts) => [...prevAlerts, { id: uniqueId(), message, open: true, props }]);
  };

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) =>
      prevAlerts.map((alert) => (alert.id === id ? { ...alert, open: false } : alert)),
    );
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, 5000);
  };

  return (
    <AppContext.Provider
      value={{
        addAlert,
        alerts,
        removeAlert,
      }}
    >
      {children}
      {alerts.map((alert) => (
        <Snackbar
          key={alert.id}
          open={alert.open}
          autoHideDuration={5000}
          onClose={() => removeAlert(alert.id)}
        >
          <Alert onClose={() => removeAlert(alert.id)} {...alert.props}>
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </AppContext.Provider>
  );
};

export default AppProvider;
