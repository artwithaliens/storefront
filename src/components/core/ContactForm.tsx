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

  const { control, errors, formState, handleSubmit, reset } = useForm<ContactFormData>({
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
            required
            as={TextField}
            control={control}
            error={'name' in errors}
            helperText={errors.name?.message}
            label="Name"
            name="name"
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
            <Controller
              control={control}
              name="acceptance"
              render={({ onChange, onBlur, value, name, ref }) => (
                <Checkbox
                  checked={value}
                  inputRef={ref}
                  name={name}
                  onBlur={onBlur}
                  onChange={(e) => onChange(e.target.checked)}
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
