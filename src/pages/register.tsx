import { isApolloError } from '@apollo/client';
import { PageWrapper } from '@components/core';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Alert, Box, Container, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { object, SchemaOf, string } from 'yup';
import { RegisterUserMutation, useRegisterUserMutation } from '../graphql';

type RegisterValues = {
  username: string;
  email: string;
  password: string;
};

const validationSchema: SchemaOf<RegisterValues> = object({
  email: string().label('Email').email().min(11).max(254).required(),
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const Register: NextPage = () => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();
  const [showAlertBar, setShowAlertBar] = useState(true);
  const router = useRouter();
  const [registerUser, { loading }] = useRegisterUserMutation();
  const { addAlert } = useUI();

  /** Hide the Status bar on cross button click. */
  const handleCloseButtonClick = () => {
    setErrorMessage(undefined);
    setShowAlertBar(false);
  };

  /**
   * Handle registration success.
   *
   * @param data Result data received
   */
  const handleRegisterUserSuccess = (data: RegisterUserMutation) => {
    if (data.registerUser?.user?.email != null) {
      localStorage.setItem('registration-success', 'yes');

      // Set form field values to empty.
      setErrorMessage(undefined);

      // Add a message.
      setSuccessMessage('Registration Successful! You will be redirected to login page now...');

      setTimeout(() => {
        // Send the user to Login page.
        router.push('/login?registered=true');
      }, 3000);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async ({ username, email, password }) => {
      try {
        const { data } = await registerUser({
          variables: { username, email, password },
        });
        if (data != null) {
          handleRegisterUserSuccess(data);
        }
      } catch (error) {
        if (isApolloError(error)) {
          addAlert(error.graphQLErrors[0].message, { severity: 'error' });
        }
      }
    },
  });

  // useEffect(() => {
  //   // Redirect the user to My Account page if user is already authenticated.
  //   if (authenticated) {
  //     router.push('/my-account');
  //   }
  // }, [authenticated, router]);

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <Box sx={{ mt: 6, pt: 6 }}>
          {/* Title */}
          <Typography gutterBottom variant="h2">
            Register
          </Typography>

          {/* Error Message */}
          {errorMessage != null && showAlertBar && (
            <Alert severity="error" onClose={handleCloseButtonClick}>
              {errorMessage}
            </Alert>
          )}

          {/* Success Message */}
          {successMessage != null && showAlertBar && (
            <Alert severity="success" onClose={handleCloseButtonClick}>
              {successMessage}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={formik.handleSubmit}>
            {/* Username */}
            <TextField
              required
              label="Username"
              value={formik.values.username}
              type="text"
              name="username"
              error={'username' in formik.errors}
              helperText={formik.errors.username}
              onChange={formik.handleChange}
            />

            {/* Email */}
            <TextField
              required
              label="Email"
              value={formik.values.email}
              type="email"
              name="email"
              error={'email' in formik.errors}
              helperText={formik.errors.email}
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
                Register
              </Button>
              <Box sx={{ ml: 1 }}>
                <Button color="secondary" href="/login">
                  Login
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default Register;
