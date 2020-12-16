import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useLocalStorage } from 'react-use';
import { LoginMutation } from '../../graphql';

type UserData = LoginMutation['login'];

type AuthContextType = {
  authToken?: string | null;
  login: (userData: UserData, urlToRedirect?: string) => void;
  logout: (urlToRedirect?: string) => void;
  userData: UserData;
};

export const AuthContext = React.createContext<AuthContextType>({
  authToken: null,
  login: () => {},
  logout: () => {},
  userData: null,
});

export const AuthProvider: React.FC = (props) => {
  const router = useRouter();

  const [userData, setUserData] = useLocalStorage<UserData>('authToken');

  /**
   * Login the user.
   *
   * @param newUserData
   * @param urlToRedirect URL where user needs to be redirected after login.
   */
  const login = (newUserData: UserData, urlToRedirect = '/my-account') => {
    // Set the authToken, user ID and username in localStorage.
    setUserData(newUserData);

    // Redirect the user to the given URL.
    if (urlToRedirect != null) {
      router.push(urlToRedirect);
    }
  };

  /**
   * Logout the user.
   *
   * @param urlToRedirect URL where user needs to be redirected after logout.
   */
  const logout = (urlToRedirect = '/login') => {
    // Set auth data value in localStorage to empty.
    setUserData(undefined);

    // Redirect the user to the given URL.
    if (urlToRedirect != null) {
      router.push(urlToRedirect);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authToken: userData?.authToken,
        login,
        logout,
        userData: userData?.authToken == null ? null : userData,
      }}
      {...props}
    />
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context == null) {
    throw new Error('useAuth must be used within a UIProvider');
  }
  return context;
}
