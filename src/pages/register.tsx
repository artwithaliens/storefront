import { isApolloError } from '@apollo/client';
import { PageWrapper } from '@components/core';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Container, TextField, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, SchemaOf, string } from 'yup';
import { RegisterMutation, useRegisterMutation } from '../graphql';

type RegisterFormData = {
  email: string;
  password: string;
  username: string;
};

const validationSchema: SchemaOf<RegisterFormData> = object({
  email: string().label('Email').email().min(11).max(254).required(),
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const Register: NextPage = () => {
  const [successMessage, setSuccessMessage] = useState<string>();
  const router = useRouter();
  const [registerUser, { loading }] = useRegisterMutation();
  const { addAlert } = useUI();

  /** Hide the Status bar on cross button click. */
  const handleCloseButtonClick = () => {
    // Remove the message.
    setSuccessMessage(undefined);
  };

  /**
   * Handle registration success.
   *
   * @param data Result data received
   */
  const handleRegisterUserSuccess = (data: RegisterMutation) => {
    if (data.registerUser?.user?.email != null) {
      // Add a message.
      setSuccessMessage('Registration Successful! You will be redirected to login page now...');

      setTimeout(() => {
        // Send the user to Login page.
        router.push('/login?registered=true');
      }, 3000);
    }
  };

  const { control, handleSubmit, errors } = useForm<RegisterFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async ({ email, password, username }) => {
    try {
      const { data } = await registerUser({
        variables: { email, password, username },
      });
      if (data != null) {
        handleRegisterUserSuccess(data);
      }
    } catch (error) {
      if (isApolloError(error)) {
        addAlert(error.graphQLErrors[0].message, { severity: 'error' });
      }
    }
  });

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <Box sx={{ mt: 6, pt: 6 }}>
          <Typography gutterBottom variant="h2">
            Register
          </Typography>
          {/* Success Message */}
          {successMessage != null && (
            <Alert severity="success" onClose={handleCloseButtonClick}>
              {successMessage}
            </Alert>
          )}
          <form onSubmit={onSubmit}>
            {/* Username */}
            <Controller
              required
              as={TextField}
              autoComplete="username"
              control={control}
              error={'username' in errors}
              helperText={errors.username?.message}
              label="Username"
              name="username"
              type="text"
            />
            {/* Email */}
            <Controller
              required
              as={TextField}
              autoComplete="email"
              control={control}
              error={'email' in errors}
              helperText={errors.email?.message}
              label="Email"
              name="email"
              type="email"
            />
            {/* Password */}
            <Controller
              required
              as={TextField}
              autoComplete="new-password"
              control={control}
              error={'password' in errors}
              helperText={errors.password?.message}
              label="Password"
              name="password"
              type="password"
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" color="primary" loading={loading}>
                Register
              </Button>
            </Box>
          </form>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default Register;
