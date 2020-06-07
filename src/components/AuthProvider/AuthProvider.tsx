import { useRouter } from 'next/router';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { LoginMutation } from '../../graphql';

export const AuthContext = React.createContext<{
  authenticated: boolean;
  authToken?: string | null;
  login: (userData: NonNullable<LoginMutation['login']>, urlToRedirect?: string) => void;
  logout: (urlToRedirect?: string) => void;
  userData: LoginMutation['login'];
}>({
  authenticated: false,
  authToken: null,
  login: () => {},
  logout: () => {},
  userData: null,
});

const AuthProvider: React.FC = ({ children }) => {
  const router = useRouter();

  const [userData, setUserData] = useLocalStorage<LoginMutation['login']>('authToken');

  /**
   * Login the user.
   *
   * @param newUserData
   * @param urlToRedirect URL where user needs to be redirected after login.
   */
  const login = (
    newUserData: NonNullable<LoginMutation['login']>,
    urlToRedirect = '/my-account',
  ) => {
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
        authenticated: userData?.authToken != null,
        authToken: userData?.authToken,
        login,
        logout,
        userData: userData?.authToken == null ? null : userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
