import { Button } from '@components/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@material-ui/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAsyncFn } from 'react-use';
import { boolean, object, SchemaOf, string } from 'yup';

type ContactFormData = {
  acceptance: boolean;
  email: string;
  fullName: string;
  message: string;
  phone?: string | null;
  subject?: string | null;
};

type ContactResponse = {
  status: 'mail_sent' | 'validation_failed';
};

const validationSchema: SchemaOf<ContactFormData> = object({
  acceptance: boolean().isTrue().required(),
  email: string().label('Email').email().min(11).max(254).required(),
  fullName: string().label('Name').max(70).required(),
  message: string().label('Message').required(),
  phone: string().label('Phone number').max(15).nullable(),
  subject: string().label('Subject').max(254).nullable(),
});

const ContactForm: React.VFC = () => {
  const [{ loading }, contact] = useAsyncFn(
    async (values?: ContactFormData) =>
      (
        await fetch('/api/contact', {
          method: 'post',
          credentials: 'include',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(values),
        })
      ).json() as Promise<ContactResponse>,
  );

  const { control, errors, handleSubmit } = useForm<ContactFormData>({
    defaultValues: {
      acceptance: false,
      email: '',
      fullName: '',
      message: '',
      phone: '',
      subject: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await contact(values);
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Name */}
          <Controller
            required
            as={TextField}
            control={control}
            error={'fullName' in errors}
            helperText={errors.fullName?.message}
            label="Name"
            name="fullName"
            type="text"
          />
        </Grid>
        <Grid item xs={6}>
          {/* Email */}
          <Controller
            required
            as={TextField}
            control={control}
            error={'email' in errors}
            helperText={errors.email?.message}
            label="Email"
            name="email"
            type="email"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Phone */}
          <Controller
            as={TextField}
            control={control}
            error={'phone' in errors}
            helperText={errors.phone?.message}
            label="Phone"
            name="phone"
            type="text"
          />
        </Grid>
        <Grid item xs={6}>
          {/* Subject */}
          <Controller
            as={TextField}
            control={control}
            error={'subject' in errors}
            helperText={errors.subject?.message}
            label="Subject"
            name="subject"
            type="text"
          />
        </Grid>
      </Grid>
      {/* Message */}
      <Controller
        multiline
        required
        as={TextField}
        control={control}
        error={'message' in errors}
        helperText={errors.message?.message}
        label="Message"
        name="message"
        rows={6}
      />
      {/* Acceptance */}
      <FormGroup>
        <FormControlLabel
          control={
            <Controller as={Checkbox} control={control} defaultValue={false} name="acceptance" />
          }
          label="I agree that my submitted data is being collected and stored."
        />
      </FormGroup>
      <Button color="primary" disabled={false} loading={loading} type="submit">
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
