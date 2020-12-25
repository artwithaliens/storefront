import { Button, CountrySelect } from '@components/ui';
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
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { mixed, object, string } from 'yup';
import { CountriesEnum, CustomerAddressInput, useUpdateCustomerMutation } from '../../graphql';

const validationSchema = object({
  address1: string().label('Street address').max(100).required(),
  address2: string().min(0).max(254),
  city: string().label('City').max(25).required(),
  company: string().label('Company').min(0).max(35),
  country: mixed<keyof typeof CountriesEnum>()
    .label('Country')
    .oneOf(Object.values(CountriesEnum))
    .required(),
  firstName: string().label('First name').max(35).required(),
  lastName: string().label('Last name').max(35).required(),
  postcode: string().label('Postcode').min(2).max(9).required(),
  state: string().label('State').min(0).max(254),
});

type Props = {
  initialValues?: CustomerAddressInput | null;
  onShippingSameAsBillingChange: (value: boolean) => void;
  onSubmit: () => void;
  shipToDifferentAddress?: boolean;
};

const ShippingForm = React.forwardRef<HTMLFormElement, Props>(
  (
    { initialValues, onShippingSameAsBillingChange, onSubmit, shipToDifferentAddress = false },
    ref,
  ) => {
    const [updateCustomer, { loading }] = useUpdateCustomerMutation({
      refetchQueries: ['Cart', 'Customer'],
    });

    const [shippingSameAsBilling, setShippingSameAsBilling] = useState(!shipToDifferentAddress);

    const formik = useFormik<CustomerAddressInput>({
      initialValues: {
        firstName: initialValues?.firstName ?? '',
        lastName: initialValues?.lastName ?? '',
        company: initialValues?.company ?? '',
        country: initialValues?.country ?? CountriesEnum.DE,
        address1: initialValues?.address1 ?? '',
        address2: initialValues?.address2 ?? '',
        postcode: initialValues?.postcode ?? '',
        city: initialValues?.city ?? '',
        state: initialValues?.state ?? '',
      },
      validationSchema,
      onSubmit: async (values) => {
        await updateCustomer({ variables: { shipping: values, shippingSameAsBilling } });
        formik.setSubmitting(false);
        onSubmit();
      },
      enableReinitialize: true,
    });

    const handleShippingSameAsBillingChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
      const nextShippingSameAsBilling = ev.target.checked;
      await updateCustomer({ variables: { shippingSameAsBilling: nextShippingSameAsBilling } });
      setShippingSameAsBilling(nextShippingSameAsBilling);
      onShippingSameAsBillingChange(nextShippingSameAsBilling);
    };

    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (shippingSameAsBilling) {
        setShippingSameAsBilling(false);
        onShippingSameAsBillingChange(false);
      }
      formik.handleChange(ev);
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
        <form ref={ref} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              {/* First Name */}
              <TextField
                required
                label="First name"
                value={formik.values.firstName}
                type="text"
                name="firstName"
                autoComplete="given-name"
                error={'firstName' in formik.errors}
                helperText={formik.errors.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              {/* Last Name */}
              <TextField
                required
                label="Last name"
                value={formik.values.lastName}
                type="text"
                name="lastName"
                autoComplete="family-name"
                error={'lastName' in formik.errors}
                helperText={formik.errors.lastName}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          {/* Company */}
          <TextField
            label="Company"
            value={formik.values.company}
            type="text"
            name="company"
            autoComplete="organization"
            error={'company' in formik.errors}
            helperText={formik.errors.company}
            onChange={handleChange}
          />
          {/* Country */}
          <CountrySelect
            required
            label="Country"
            value={formik.values.country}
            name="country"
            error={'country' in formik.errors}
            helperText={formik.errors.country}
            onChange={formik.handleChange}
          />
          {/* Address */}
          <TextField
            required
            label="Street address"
            type="text"
            value={formik.values.address1}
            name="address1"
            autoComplete="address-line1"
            placeholder="House number and street name"
            error={'address1' in formik.errors}
            helperText={formik.errors.address1}
            onChange={handleChange}
          />
          <TextField
            type="text"
            value={formik.values.address2}
            name="address2"
            autoComplete="address-line2"
            placeholder="Apartment, suite, unit etc. (optional)"
            error={'address2' in formik.errors}
            helperText={formik.errors.address2}
            onChange={handleChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={3}>
              {/* Postcode */}
              <TextField
                required
                label="Postcode"
                value={formik.values.postcode}
                type="text"
                name="postcode"
                autoComplete="postal-code"
                error={'postcode' in formik.errors}
                helperText={formik.errors.postcode}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={9}>
              {/* City */}
              <TextField
                required
                label="City"
                value={formik.values.city}
                type="text"
                name="city"
                autoComplete="address-level2"
                error={'city' in formik.errors}
                helperText={formik.errors.city}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          {/* State */}
          <TextField
            label="State"
            value={formik.values.state}
            type="text"
            name="state"
            autoComplete="address-level1"
            error={'state' in formik.errors}
            helperText={formik.errors.state}
            onChange={handleChange}
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
