import { isApolloError } from '@apollo/client';
import { Button, Link, Logo } from '@components/ui';
import { useUI } from '@components/ui/context';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { LoginMutationVariables, useLoginMutation } from 'src/graphql';
import { object, SchemaOf, string } from 'yup';

const validationSchema: SchemaOf<LoginMutationVariables> = object({
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const LoginView: React.VFC = () => {
  const [alert, setAlert] = useState<string>();
  const { closeModal } = useUI();
  const [login, { loading }] = useLoginMutation();

  const { control, errors, handleSubmit } = useForm<LoginMutationVariables>({
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
          required
          as={TextField}
          autoCapitalize="off"
          autoCorrect="off"
          control={control}
          error={'username' in errors}
          helperText={errors.username?.message}
          label="Username or email"
          name="username"
          type="text"
        />
        {/* Password */}
        <Controller
          required
          as={TextField}
          control={control}
          error={'password' in errors}
          helperText={errors.password?.message}
          label="Password"
          name="password"
          type="password"
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
