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
import countries from '../../countryList';
import { CountriesEnum, CustomerAddressInput, useUpdateCustomerMutation } from '../../graphql';
import Button from '../Button';

const validationSchema = object().shape<CustomerAddressInput>({
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

const ShippingForm: React.FC<Props> = ({
  initialValues,
  onShippingSameAsBillingChange,
  onSubmit,
  shipToDifferentAddress = false,
}) => {
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
      city: initialValues?.city ?? '',
      state: initialValues?.state ?? '',
      postcode: initialValues?.postcode ?? '',
    },
    validationSchema,
    onSubmit: (values) => {
      updateCustomer({ variables: { shipping: values, shippingSameAsBilling } }).then((data) => {
        formik.setSubmitting(false);
        onSubmit();
      });
    },
    enableReinitialize: true,
  });

  const handleShippingSameAsBillingChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const nextShippingSameAsBilling = ev.target.checked;
    updateCustomer({ variables: { shippingSameAsBilling: nextShippingSameAsBilling } }).then(() => {
      setShippingSameAsBilling(nextShippingSameAsBilling);
      onShippingSameAsBillingChange(nextShippingSameAsBilling);
    });
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
      <Box mb={4}>
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
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* First Name */}
            <FormGroup>
              <TextField
                required
                label="First name"
                value={formik.values.firstName}
                type="text"
                name="firstName"
                error={'firstName' in formik.errors}
                helperText={formik.errors.firstName}
                onChange={handleChange}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={6}>
            {/* Last Name */}
            <FormGroup>
              <TextField
                required
                label="Last name"
                value={formik.values.lastName}
                type="text"
                name="lastName"
                error={'lastName' in formik.errors}
                helperText={formik.errors.lastName}
                onChange={handleChange}
              />
            </FormGroup>
          </Grid>
        </Grid>
        {/* Company */}
        <FormGroup>
          <TextField
            label="Company"
            value={formik.values.company}
            type="text"
            name="company"
            error={'company' in formik.errors}
            helperText={formik.errors.company}
            onChange={handleChange}
          />
        </FormGroup>
        {/* Country */}
        <FormGroup>
          <TextField
            select
            required
            label="Country"
            value={formik.values.country}
            name="country"
            error={'country' in formik.errors}
            helperText={formik.errors.country}
            SelectProps={{
              native: true,
            }}
            onChange={handleChange}
          >
            <option value="">Select a country...</option>
            {Object.entries(countries).map(([value, country]) => (
              <option key={value} value={value}>
                {country}
              </option>
            ))}
          </TextField>
        </FormGroup>
        {/* Address */}
        <FormGroup>
          <TextField
            required
            label="Street address"
            type="text"
            value={formik.values.address1}
            name="address1"
            placeholder="House number and street name"
            error={'address1' in formik.errors}
            helperText={formik.errors.address1}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <TextField
            type="text"
            value={formik.values.address2}
            name="address2"
            placeholder="Apartment, suite, unit etc. (optional)"
            error={'address2' in formik.errors}
            helperText={formik.errors.address2}
            onChange={handleChange}
          />
        </FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            {/* Postcode */}
            <FormGroup>
              <TextField
                required
                label="Postcode"
                value={formik.values.postcode}
                type="text"
                name="postcode"
                error={'postcode' in formik.errors}
                helperText={formik.errors.postcode}
                onChange={handleChange}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={9}>
            {/* City */}
            <FormGroup>
              <TextField
                required
                label="City"
                value={formik.values.city}
                type="text"
                name="city"
                error={'city' in formik.errors}
                helperText={formik.errors.city}
                onChange={handleChange}
              />
            </FormGroup>
          </Grid>
        </Grid>
        {/* State */}
        <FormGroup>
          <TextField
            label="State"
            value={formik.values.state}
            type="text"
            name="state"
            error={'state' in formik.errors}
            helperText={formik.errors.state}
            onChange={handleChange}
          />
        </FormGroup>
        <Box mt={2}>
          <Button type="submit" color="primary" loading={loading}>
            Continue to Shipping Method
          </Button>
        </Box>
      </form>
    </>
  );
};

export default ShippingForm;
