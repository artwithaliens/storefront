import {
  Box,
  CircularProgress,
  Container,
  FormGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { ApolloError } from 'apollo-boost';
import { useFormik } from 'formik';
import { ExecutionResult } from 'graphql';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { object, string } from 'yup';
import { AppContext } from '../components/AppProvider';
import { AuthContext } from '../components/AuthProvider';
import Button from '../components/Button';
import Layout from '../components/Layout';
import { LoginMutation, useLoginMutation } from '../graphql';
import withApollo from '../withApollo';

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
  const { addAlert } = useContext(AppContext);

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
    <Layout>
      <Container maxWidth="sm">
        <Box mt={6} pt={6}>
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
            <FormGroup>
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
            </FormGroup>

            {/* Password */}
            <FormGroup>
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
            </FormGroup>

            {/* Submit Button */}
            <FormGroup>
              <Button color="primary" disabled={loading} type="submit">
                Login
              </Button>
              <Button href="/register" color="default">
                Register
              </Button>
            </FormGroup>

            {/* Loading */}
            {loading && <CircularProgress />}
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default withApollo(Login);
