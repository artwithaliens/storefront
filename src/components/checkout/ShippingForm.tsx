import { Button, CountrySelect } from '@components/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { mixed, object, SchemaOf, string } from 'yup';
import { CountriesEnum, CustomerAddressInput, useUpdateCustomerMutation } from '../../graphql';

const validationSchema: SchemaOf<
  Omit<CustomerAddressInput, 'email' | 'overwrite' | 'phone'>
> = object({
  address1: string().label('Street address').max(100).required(),
  address2: string().min(0).max(254),
  city: string().label('City').max(25).required(),
  company: string().label('Company').min(0).max(35),
  country: mixed().label('Country').oneOf(Object.values(CountriesEnum)).required(),
  firstName: string().label('First name').max(35).required(),
  lastName: string().label('Last name').max(35).required(),
  postcode: string().label('Postcode').min(2).max(9).required(),
  state: string().label('State').min(0).max(254),
});

type Props = {
  defaultValues?: CustomerAddressInput | null;
  onShippingSameAsBillingChange: (value: boolean) => void;
  onSubmit: () => void;
  shipToDifferentAddress?: boolean;
};

const ShippingForm = React.forwardRef<HTMLFormElement, Props>(
  (
    {
      defaultValues,
      onShippingSameAsBillingChange,
      onSubmit: onSubmitProp,
      shipToDifferentAddress = false,
    },
    ref,
  ) => {
    const [updateCustomer, { loading }] = useUpdateCustomerMutation({
      refetchQueries: ['Cart', 'Customer'],
    });

    const [shippingSameAsBilling, setShippingSameAsBilling] = useState(!shipToDifferentAddress);

    const { control, formState, handleSubmit, reset } = useForm<CustomerAddressInput>({
      defaultValues: {
        address1: defaultValues?.address1 ?? '',
        address2: defaultValues?.address2 ?? '',
        city: defaultValues?.city ?? '',
        company: defaultValues?.company ?? '',
        country: defaultValues?.country ?? CountriesEnum.DE,
        firstName: defaultValues?.firstName ?? '',
        lastName: defaultValues?.lastName ?? '',
        postcode: defaultValues?.postcode ?? '',
        state: defaultValues?.state ?? '',
      },
      resolver: yupResolver(validationSchema),
    });

    useEffect(() => {
      reset({
        address1: defaultValues?.address1 ?? '',
        address2: defaultValues?.address2 ?? '',
        city: defaultValues?.city ?? '',
        company: defaultValues?.company ?? '',
        country: defaultValues?.country ?? CountriesEnum.DE,
        firstName: defaultValues?.firstName ?? '',
        lastName: defaultValues?.lastName ?? '',
        postcode: defaultValues?.postcode ?? '',
        state: defaultValues?.state ?? '',
      });
    }, [defaultValues, reset]);

    const onSubmit = handleSubmit(async (shipping) => {
      await updateCustomer({ variables: { shipping, shippingSameAsBilling } });
      onSubmitProp();
    });

    const handleShippingSameAsBillingChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const nextShippingSameAsBilling = ev.target.checked;
      await updateCustomer({ variables: { shippingSameAsBilling: nextShippingSameAsBilling } });
      setShippingSameAsBilling(nextShippingSameAsBilling);
      onShippingSameAsBillingChange(nextShippingSameAsBilling);
      reset();
    };

    const handleChange = (
      onChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void,
    ) => (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onChange(event);

      if (shippingSameAsBilling) {
        setShippingSameAsBilling(false);
        onShippingSameAsBillingChange(false);
      }
    };

    return (
      <>
        <Typography gutterBottom variant="h3">
          Shipping Address
        </Typography>
        <Box sx={{ mb: 4 }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  name="shippingSameAsBilling"
                  checked={shippingSameAsBilling}
                  onChange={handleShippingSameAsBillingChange}
                />
              }
              label="Same as Billing address"
            />
          </FormGroup>
          <Divider />
        </Box>
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
                    onChange={handleChange(field.onChange)}
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
                    onChange={handleChange(field.onChange)}
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
                onChange={handleChange(field.onChange)}
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
                onChange={handleChange(field.onChange)}
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
                onChange={handleChange(field.onChange)}
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
                onChange={handleChange(field.onChange)}
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
                    onChange={handleChange(field.onChange)}
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
                    onChange={handleChange(field.onChange)}
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
                onChange={handleChange(field.onChange)}
              />
            )}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" color="primary" loading={loading}>
              Continue to Shipping Method
            </Button>
          </Box>
        </form>
      </>
    );
  },
);

export default ShippingForm;
