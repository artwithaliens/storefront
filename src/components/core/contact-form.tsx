import { Button } from '@components/ui';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import { useAsyncFn } from 'react-use';
import { boolean, object, string } from 'yup';

type ContactInput = {
  acceptance: boolean;
  email: string;
  fullName: string;
  message: string;
  phone?: string;
  subject?: string;
};

type ContactResponse = {
  status: 'mail_sent' | 'validation_failed';
};

const validationSchema = object().shape<ContactInput>({
  acceptance: boolean().required().oneOf([true]),
  email: string().label('Email').email().min(11).max(254).required(),
  fullName: string().label('Name').max(70).required(),
  message: string().label('Message').required(),
  phone: string().label('Phone number').min(10).max(15),
  subject: string().label('Subject').max(254),
});

const ContactForm: React.VFC = () => {
  const [{ loading }, contact] = useAsyncFn((values?: ContactInput) =>
    fetch('/api/contact', {
      method: 'post',
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(values),
    }).then((response) => response.json() as Promise<ContactResponse>),
  );

  const formik = useFormik<ContactInput>({
    initialValues: {
      acceptance: false,
      email: '',
      fullName: '',
      message: '',
      phone: '',
      subject: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      contact(values).then(() => {
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Name */}
          <TextField
            required
            label="Name"
            value={formik.values.fullName}
            type="text"
            name="fullName"
            error={'fullName' in formik.errors}
            helperText={formik.errors.fullName}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Phone */}
          <TextField
            label="Phone"
            value={formik.values.phone}
            type="text"
            name="phone"
            error={'phone' in formik.errors}
            helperText={formik.errors.phone}
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          {/* Subject */}
          <TextField
            label="Subject"
            value={formik.values.subject}
            type="text"
            name="subject"
            error={'subject' in formik.errors}
            helperText={formik.errors.subject}
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
      {/* Message */}
      <TextField
        required
        multiline
        label="Message"
        value={formik.values.message}
        rows={6}
        name="message"
        error={'message' in formik.errors}
        helperText={formik.errors.message}
        onChange={formik.handleChange}
      />
      {/* Acceptance */}
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              name="acceptance"
              checked={formik.values.acceptance}
              onChange={formik.handleChange}
            />
          }
          label="I agree that my submitted data is being collected and stored."
        />
      </FormGroup>
      <Button
        type="submit"
        color="primary"
        disabled={!formik.values.acceptance}
        loading={loading || formik.isSubmitting}
      >
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
