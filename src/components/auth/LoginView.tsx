import { isApolloError } from '@apollo/client';
import { Button, Link, Logo } from '@components/ui';
import { useUI } from '@components/ui/context';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { object, SchemaOf, string } from 'yup';
import { LoginMutationVariables, useLoginMutation } from '../../graphql';

const validationSchema: SchemaOf<LoginMutationVariables> = object({
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const LoginView: React.VFC = () => {
  const [alert, setAlert] = useState<string>();
  const { closeModal } = useUI();
  const [login, { loading }] = useLoginMutation();

  const { control, formState, handleSubmit } = useForm<LoginMutationVariables>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (variables) => {
    try {
      const { data } = await login({ variables });

      if (data?.login?.authToken != null) {
        localStorage.setItem('authToken', data.login.authToken);
      }
      if (data?.login?.refreshToken != null) {
        localStorage.setItem('refreshToken', data.login.refreshToken);
      }
      closeModal();
    } catch (error) {
      if (isApolloError(error)) {
        setAlert(error.graphQLErrors[0].message);
      }
    }
  });

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Logo />
      </Box>
      <form onSubmit={onSubmit}>
        {alert && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{alert}</Alert>
          </Box>
        )}
        {/* Username or email */}
        <Controller
          control={control}
          name="username"
          render={({ field }) => (
            <TextField
              required
              autoCapitalize="off"
              autoCorrect="off"
              error={'username' in formState.errors}
              helperText={formState.errors.username?.message}
              label="Username or email"
              type="text"
              {...field}
            />
          )}
        />
        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextField
              required
              error={'password' in formState.errors}
              helperText={formState.errors.password?.message}
              label="Password"
              type="password"
              {...field}
            />
          )}
        />
        <Box sx={{ mt: 1 }}>
          <Button fullWidth type="submit" color="primary" loading={loading}>
            Log in
          </Button>
        </Box>
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          Don’t have an account? <Link href="/register">Register</Link>
        </Box>
      </form>
    </>
  );
};

export default LoginView;
