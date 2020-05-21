import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import { useAsyncFn } from 'react-use';
import { boolean, object, string } from 'yup';
import Button from '../Button';

type ContactInput = {
  acceptance: boolean;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

type ContactResponse = {
  into: string;
  status: 'mail_sent' | 'validation_failed';
  message: string;
  invalidFields?: {
    into: string;
    message: string;
    idref: null;
  }[];
};

const validationSchema = object().shape<ContactInput>({
  acceptance: boolean().required(),
  email: string().label('Email').email().min(11).max(254).required(),
  fullName: string().label('Name').max(70).required(),
  message: string().label('Message').required(),
  phone: string().label('Phone number').min(10).max(15),
  subject: string().label('Subject').max(254),
});

const ContactForm: React.FC = () => {
  const [, contact] = useAsyncFn(async (values?: ContactInput) => {
    const body = new FormData();
    Object.entries(values ?? {}).forEach(
      ([key, value]) => value != null && body.append(key, value.toString()),
    );

    const response = await fetch(
      `${process.env.REST_URL}/contact-form-7/v1/contact-forms/5/feedback`,
      {
        method: 'post',
        credentials: 'include',
        body,
      },
    );
    return response.json() as Promise<ContactResponse>;
  });

  const formik = useFormik<ContactInput>({
    initialValues: {
      acceptance: false,
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    validationSchema,
    validateOnChange: false,
    onSubmit: (values) => {
      contact(values).then((response) => {
        formik.setSubmitting(false);
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Name */}
          <FormGroup>
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
          </FormGroup>
        </Grid>
        <Grid item xs={6}>
          {/* Email */}
          <FormGroup>
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
          </FormGroup>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Phone */}
          <FormGroup>
            <TextField
              label="Phone"
              value={formik.values.phone}
              type="text"
              name="phone"
              error={'phone' in formik.errors}
              helperText={formik.errors.phone}
              onChange={formik.handleChange}
            />
          </FormGroup>
        </Grid>
        <Grid item xs={6}>
          {/* Subject */}
          <FormGroup>
            <TextField
              label="Subject"
              value={formik.values.subject}
              type="text"
              name="subject"
              error={'subject' in formik.errors}
              helperText={formik.errors.subject}
              onChange={formik.handleChange}
            />
          </FormGroup>
        </Grid>
      </Grid>
      {/* Message */}
      <FormGroup>
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
      </FormGroup>
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
      <Button type="submit" color="primary" loading={formik.isSubmitting}>
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
