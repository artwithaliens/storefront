import { isApolloError } from '@apollo/client';
import { Button } from '@components/ui';
import { useUI } from '@components/ui/context';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { boolean, object, SchemaOf, string } from 'yup';
import { ContactMutationVariables, useContactMutation } from '../../graphql';

type ContactFormData = ContactMutationVariables & {
  acceptance: boolean;
};

const validationSchema: SchemaOf<ContactFormData> = object({
  acceptance: boolean().isTrue().required(),
  email: string().label('Email').email().min(11).max(254).required(),
  name: string().label('Name').max(70).required(),
  message: string().label('Message').required(),
  phone: string().label('Phone number').max(15).nullable(),
  subject: string().label('Subject').max(254).nullable(),
});

const ContactForm: React.VFC = () => {
  const { addAlert } = useUI();
  const [shouldSend, setShouldSend] = useState(true);

  const [contact, { loading }] = useContactMutation();

  const { control, formState, handleSubmit, reset } = useForm<ContactFormData>({
    defaultValues: {
      acceptance: false,
      email: '',
      name: '',
      message: '',
      phone: '',
      subject: '',
    },
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    if (shouldSend) {
      try {
        const { data } = await contact({ variables: values });
        if (data?.contact?.message != null) {
          addAlert(data.contact.message);
          reset();
        }
      } catch (error) {
        if (isApolloError(error)) {
          addAlert(error.message, { severity: 'error' });
        }
      }
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Name */}
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <TextField
                required
                error={'name' in formState.errors}
                helperText={formState.errors.name?.message}
                label="Name"
                type="text"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <TextField
                required
                error={'email' in formState.errors}
                helperText={formState.errors.email?.message}
                label="Email"
                type="email"
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          {/* Phone */}
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <TextField
                error={'phone' in formState.errors}
                helperText={formState.errors.phone?.message}
                label="Phone"
                type="text"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          {/* Subject */}
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <TextField
                error={'subject' in formState.errors}
                helperText={formState.errors.subject?.message}
                label="Subject"
                type="text"
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
      {/* Message */}
      <Controller
        control={control}
        name="message"
        render={({ field }) => (
          <TextField
            multiline
            required
            error={'message' in formState.errors}
            helperText={formState.errors.message?.message}
            label="Message"
            rows={6}
            {...field}
          />
        )}
      />
      {/* Acceptance */}
      <FormGroup>
        <FormControlLabel
          control={
            <Controller
              control={control}
              name="acceptance"
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  inputRef={field.ref}
                  name={field.name}
                  onBlur={() => field.onBlur()}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          }
          label="I agree that my submitted data is being collected and stored."
        />
      </FormGroup>
      {/* Acceptance */}
      <FormGroup>
        <FormControlLabel
          control={<Checkbox onChange={(e) => setShouldSend(!e.target.checked)} />}
          label="If you are a spambot, you should check this."
        />
      </FormGroup>
      <Button type="submit" color="primary" disabled={!formState.isValid} loading={loading}>
        Submit
      </Button>
    </form>
  );
};

export default ContactForm;
