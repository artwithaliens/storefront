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

    const { control, errors, handleSubmit } = useForm<CustomerAddressInput>({
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
                required
                as={TextField}
                autoComplete="given-name"
                control={control}
                defaultValue=""
                error={'firstName' in errors}
                helperText={errors.firstName?.message}
                label="First name"
                name="firstName"
                type="text"
              />
            </Grid>
            <Grid item xs={6}>
              {/* Last Name */}
              <Controller
                required
                as={TextField}
                autoComplete="family-name"
                control={control}
                defaultValue=""
                error={'lastName' in errors}
                helperText={errors.lastName?.message}
                label="Last name"
                name="lastName"
                type="text"
              />
            </Grid>
          </Grid>
          {/* Company */}
          <Controller
            as={TextField}
            autoComplete="organization"
            control={control}
            defaultValue=""
            error={'company' in errors}
            helperText={errors.company?.message}
            label="Company"
            name="company"
            type="text"
          />
          {/* Country */}
          <Controller
            required
            as={CountrySelect}
            control={control}
            defaultValue={CountriesEnum.DE}
            error={'country' in errors}
            helperText={errors.country?.message}
            label="Country"
            name="country"
          />
          {/* Address */}
          <Controller
            required
            as={TextField}
            autoComplete="address-line1"
            control={control}
            defaultValue=""
            error={'address1' in errors}
            helperText={errors.address1?.message}
            label="Street address"
            name="address1"
            placeholder="House number and street name"
            type="text"
          />
          <Controller
            as={TextField}
            autoComplete="address-line2"
            control={control}
            defaultValue=""
            error={'address2' in errors}
            helperText={errors.address2?.message}
            name="address2"
            placeholder="Apartment, suite, unit etc. (optional)"
            type="text"
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              {/* Postcode */}
              <Controller
                required
                as={TextField}
                autoComplete="postal-code"
                control={control}
                defaultValue=""
                error={'postcode' in errors}
                helperText={errors.postcode?.message}
                label="Postcode"
                name="postcode"
                type="text"
              />
            </Grid>
            <Grid item xs={9}>
              {/* City */}
              <Controller
                required
                as={TextField}
                autoComplete="address-level2"
                control={control}
                defaultValue=""
                error={'city' in errors}
                helperText={errors.city?.message}
                label="City"
                name="city"
                type="text"
              />
            </Grid>
          </Grid>
          {/* State */}
          <Controller
            as={TextField}
            autoComplete="address-level1"
            control={control}
            defaultValue=""
            error={'state' in errors}
            helperText={errors.state?.message}
            label="State"
            name="state"
            type="text"
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* Phone */}
              <Controller
                required
                as={TextField}
                autoComplete="tel"
                control={control}
                defaultValue=""
                error={'phone' in errors}
                helperText={errors.phone?.message}
                label="Phone"
                name="phone"
                type="text"
              />
            </Grid>
            <Grid item xs={6}>
              {/* Email */}
              <Controller
                required
                as={TextField}
                autoComplete="email"
                control={control}
                defaultValue=""
                error={'email' in errors}
                helperText={errors.email?.message}
                label="Email"
                name="email"
                type="email"
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
