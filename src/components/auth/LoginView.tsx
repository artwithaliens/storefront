import { ApolloError } from '@apollo/client';
import { Button, Link, Logo } from '@components/ui';
import { useUI } from '@components/ui/context';
import { Alert, Box, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useLoginMutation } from 'src/graphql';
import { object, SchemaOf, string } from 'yup';

type LoginInput = {
  username: string;
  password: string;
};

const validationSchema: SchemaOf<LoginInput> = object({
  password: string().label('Password').min(8).max(35).required(),
  username: string().label('Username').max(35).required(),
});

const LoginView: React.VFC = () => {
  const [alert, setAlert] = useState<string>();
  const { closeModal } = useUI();
  const [login, { loading }] = useLoginMutation();

  const formik = useFormik<LoginInput>({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      login({
        variables: values,
      })
        .then(({ data }) => {
          if (data?.login?.authToken != null) {
            localStorage.setItem('authToken', data.login.authToken);
          }
          if (data?.login?.refreshToken != null) {
            localStorage.setItem('refreshToken', data.login.refreshToken);
          }
          closeModal();
        })
        .catch((error: ApolloError) => {
          setAlert(error.graphQLErrors[0].message);
        });
    },
  });

  return (
    <>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Logo />
      </Box>
      <form onSubmit={formik.handleSubmit}>
        {alert && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{alert}</Alert>
          </Box>
        )}
        {/* Username or email */}
        <TextField
          required
          autoCapitalize="off"
          autoCorrect="off"
          error={'username' in formik.errors}
          helperText={formik.errors.username}
          label="Username or email"
          name="username"
          type="text"
          value={formik.values.username}
          onChange={formik.handleChange}
        />
        {/* Password */}
        <TextField
          required
          error={'password' in formik.errors}
          helperText={formik.errors.password}
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
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
