import { AlertProps, ThemeProvider } from '@material-ui/core';
import uniqueId from 'lodash/uniqueId';
import React, { useContext, useMemo, useReducer } from 'react';
import theme from './theme';

type AlertItem = {
  id: string;
  message: string;
  open: boolean;
  props?: Partial<AlertProps>;
};

type ModalView = 'SIGNUP_VIEW' | 'LOGIN_VIEW' | 'FORGOT_VIEW';

type State = {
  alerts: AlertItem[];
  displayModal: boolean;
  modalView: ModalView;
};

const initialState: State = {
  alerts: [],
  displayModal: false,
  modalView: 'LOGIN_VIEW',
};

type Action =
  | {
      type: 'ADD_ALERT';
      message: string;
      props?: Partial<AlertProps>;
    }
  | {
      type: 'REMOVE_ALERT';
      id: string;
    }
  | {
      type: 'OPEN_MODAL';
    }
  | {
      type: 'CLOSE_MODAL';
    }
  | {
      type: 'SET_MODAL_VIEW';
      view: ModalView;
    };

type UIContextType = State & {
  addAlert: (message: string, props?: Partial<AlertProps>) => void;
  removeAlert: (id: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setModalView: (view: ModalView) => void;
};

export const UIContext = React.createContext<UIContextType>({
  ...initialState,
  addAlert: () => {},
  removeAlert: () => {},
  openModal: () => {},
  closeModal: () => {},
  setModalView: () => {},
});

const UIProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'ADD_ALERT':
        return {
          ...state,
          alerts: [
            ...state.alerts,
            {
              id: uniqueId(),
              message: action.message,
              open: true,
              props: action.props,
            },
          ],
        };
      case 'REMOVE_ALERT':
        return {
          ...state,
          alerts: state.alerts.map((alert) =>
            alert.id === action.id ? { ...alert, open: false } : alert,
          ),
        };
      case 'OPEN_MODAL':
        return {
          ...state,
          displayModal: true,
        };
      case 'CLOSE_MODAL':
        return {
          ...state,
          displayModal: false,
        };
      case 'SET_MODAL_VIEW':
        return {
          ...state,
          modalView: action.view,
        };
      default:
        return state;
    }
  }, initialState);

  const addAlert = (message: string, props?: Partial<AlertProps>) =>
    dispatch({ type: 'ADD_ALERT', message, props });
  const removeAlert = (id: string) => dispatch({ type: 'REMOVE_ALERT', id });

  const openModal = () => dispatch({ type: 'OPEN_MODAL' });
  const closeModal = () => dispatch({ type: 'CLOSE_MODAL' });

  const setModalView = (view: ModalView) => dispatch({ type: 'SET_MODAL_VIEW', view });

  const value = useMemo<UIContextType>(
    () => ({
      ...state,
      addAlert,
      removeAlert,
      openModal,
      closeModal,
      setModalView,
    }),
    [state],
  );

  return <UIContext.Provider value={value} {...props} />;
};

export function useUI() {
  const context = useContext(UIContext);
  if (context == null) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export const ManagedUIContext: React.FC = ({ children }) => (
  <UIProvider>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </UIProvider>
);
