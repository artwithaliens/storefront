import { ApolloError } from '@apollo/client';
import { Alert, Box, Container, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import { ExecutionResult } from 'graphql';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { object, string } from 'yup';
import { AlertContext } from '../components/core/alert-provider';
import { AuthContext } from '../components/core/auth-provider';
import PageWrapper from '../components/core/page-wrapper';
import { Button } from '../components/ui';
import { LoginMutation, useLoginMutation } from '../graphql';

type LoginValues = {
  username: string;
  password: string;
};

const validationSchema = object().shape<LoginValues>({
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const Login: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [showAlertBar, setShowAlertBar] = useState(true);
  const router = useRouter();
  const [login, { loading }] = useLoginMutation();
  const { authenticated, ...auth } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);

  /** Hide the status bar on cross button click. */
  const handleCloseButtonClick = () => {
    setErrorMessage(undefined);
    setShowAlertBar(false);
  };

  /**
   * Handle login success.
   *
   * @param result Result received
   */
  const handleLoginSuccess = (result: ExecutionResult<LoginMutation>) => {
    if (result.data?.login?.authToken != null) {
      auth.login(result.data.login, '/my-account');

      // Set form field values to empty.
      setErrorMessage(undefined);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: ({ username, password }: LoginValues) => {
      if (process.browser) {
        login({
          variables: { username, password },
        })
          .then(handleLoginSuccess)
          .catch((error: ApolloError) =>
            addAlert(error.graphQLErrors[0].message, { severity: 'error' }),
          );
      }
    },
  });

  useEffect(() => {
    // If user is already authenticated, redirect the user to My Account page.
    if (authenticated) {
      router.push('/my-account');
    }
  }, [authenticated, router]);

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <Box sx={{ mt: 6, pt: 6 }}>
          {/* Title */}
          <Typography gutterBottom variant="h2">
            Login
          </Typography>

          {/* Error Message */}
          {errorMessage != null && showAlertBar && (
            <Alert severity="error" onClose={handleCloseButtonClick}>
              {errorMessage}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Username or email */}
            <TextField
              required
              autoCapitalize="off"
              autoCorrect="off"
              label="Username or email"
              value={formik.values.username}
              type="text"
              name="username"
              error={'username' in formik.errors}
              helperText={formik.errors.username}
              onChange={formik.handleChange}
            />

            {/* Password */}
            <TextField
              required
              label="Password"
              value={formik.values.password}
              type="password"
              name="password"
              error={'password' in formik.errors}
              helperText={formik.errors.password}
              onChange={formik.handleChange}
            />

            {/* Submit Button */}
            <Box sx={{ mt: 2 }}>
              <Button type="submit" color="primary" loading={loading}>
                Login
              </Button>
              <Box sx={{ ml: 1 }}>
                <Button color="secondary" href="/register">
                  Register
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default Login;
