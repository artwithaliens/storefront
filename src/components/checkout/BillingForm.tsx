import { Button, CountrySelect } from '@components/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Grid, TextField, Typography } from '@material-ui/core';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { mixed, object, SchemaOf, string } from 'yup';
import { CountriesEnum, CustomerAddressInput, useUpdateCustomerMutation } from '../../graphql';

const validationSchema: SchemaOf<Omit<CustomerAddressInput, 'overwrite'>> = object({
  address1: string().label('Street address').max(100).required(),
  address2: string().min(0).max(254).nullable(),
  city: string().label('City').max(25).required(),
  company: string().label('Company').min(0).max(35).nullable(),
  country: mixed().label('Country').oneOf(Object.values(CountriesEnum)).required(),
  email: string().label('Email').email().min(11).max(254).required(),
  firstName: string().label('First name').max(35).required(),
  lastName: string().label('Last name').max(35).required(),
  phone: string().label('Phone number').min(10).max(15).required(),
  postcode: string().label('Postcode').min(2).max(9).required(),
  state: string().label('State').min(0).max(254).nullable(),
});

type Props = {
  defaultValues?: CustomerAddressInput | null;
  onSubmit: () => void;
};

const BillingForm = React.forwardRef<HTMLFormElement, Props>(
  ({ defaultValues, onSubmit: onSubmitProp }, ref) => {
    const [updateCustomer, { loading }] = useUpdateCustomerMutation({
      refetchQueries: ['Cart', 'Customer'],
    });

    const { control, formState, handleSubmit } = useForm<CustomerAddressInput>({
      defaultValues: {
        address1: defaultValues?.address1 ?? '',
        address2: defaultValues?.address2 ?? '',
        city: defaultValues?.city ?? '',
        company: defaultValues?.company ?? '',
        country: defaultValues?.country ?? CountriesEnum.DE,
        email: defaultValues?.email ?? '',
        firstName: defaultValues?.firstName ?? '',
        lastName: defaultValues?.lastName ?? '',
        phone: defaultValues?.phone ?? '',
        postcode: defaultValues?.postcode ?? '',
        state: defaultValues?.state ?? '',
      },
      resolver: yupResolver(validationSchema),
    });

    const onSubmit = handleSubmit(async (billing) => {
      await updateCustomer({ variables: { billing } });
      onSubmitProp();
    });

    return (
      <>
        <Typography gutterBottom variant="h3">
          Billing Address
        </Typography>
        <form ref={ref} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* First Name */}
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="given-name"
                    error={'firstName' in formState.errors}
                    helperText={formState.errors.firstName?.message}
                    label="First name"
                    type="text"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              {/* Last Name */}
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="family-name"
                    error={'lastName' in formState.errors}
                    helperText={formState.errors.lastName?.message}
                    label="Last name"
                    type="text"
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* Company */}
          <Controller
            control={control}
            name="company"
            render={({ field }) => (
              <TextField
                autoComplete="organization"
                error={'company' in formState.errors}
                helperText={formState.errors.company?.message}
                label="Company"
                type="text"
                {...field}
              />
            )}
          />
          {/* Country */}
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <CountrySelect
                required
                error={'country' in formState.errors}
                helperText={formState.errors.country?.message}
                label="Country"
                {...field}
              />
            )}
          />
          {/* Address */}
          <Controller
            control={control}
            name="address1"
            render={({ field }) => (
              <TextField
                required
                autoComplete="address-line1"
                error={'address1' in formState.errors}
                helperText={formState.errors.address1?.message}
                label="Street address"
                placeholder="House number and street name"
                type="text"
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="address2"
            render={({ field }) => (
              <TextField
                autoComplete="address-line2"
                error={'address2' in formState.errors}
                helperText={formState.errors.address2?.message}
                placeholder="Apartment, suite, unit etc. (optional)"
                type="text"
                {...field}
              />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              {/* Postcode */}
              <Controller
                control={control}
                name="postcode"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="postal-code"
                    error={'postcode' in formState.errors}
                    helperText={formState.errors.postcode?.message}
                    label="Postcode"
                    type="text"
                    {...field}
                  />
                )}
              />
            </Grid>
            <Grid item xs={9}>
              {/* City */}
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="address-level2"
                    error={'city' in formState.errors}
                    helperText={formState.errors.city?.message}
                    label="City"
                    type="text"
                    {...field}
                  />
                )}
              />
            </Grid>
          </Grid>
          {/* State */}
          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <TextField
                autoComplete="address-level1"
                error={'state' in formState.errors}
                helperText={formState.errors.state?.message}
                label="State"
                type="text"
                {...field}
              />
            )}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Phone */}
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="tel"
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
              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextField
                    required
                    autoComplete="email"
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
          <Box sx={{ mt: 2 }}>
            <Button type="submit" color="primary" loading={loading}>
              Continue to Shipping Address
            </Button>
          </Box>
        </form>
      </>
    );
  },
);

export default BillingForm;
