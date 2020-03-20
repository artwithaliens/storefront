import { Box, FormGroup, Grid, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
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
  email: string().label('Email').email().min(11).max(254).required(),
  firstName: string().label('First name').max(35).required(),
  lastName: string().label('Last name').max(35).required(),
  phone: string().label('Phone number').min(10).max(15).required(),
  postcode: string().label('Postcode').min(2).max(9).required(),
  state: string().label('State').min(0).max(254),
});

type Props = {
  initialValues?: CustomerAddressInput | null;
  onSubmit: () => void;
};

const BillingForm: React.FC<Props> = ({ initialValues, onSubmit }) => {
  const [updateCustomer, { loading }] = useUpdateCustomerMutation({
    refetchQueries: ['Cart', 'Customer'],
  });

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
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
    },
    validationSchema,
    onSubmit: (values) => {
      updateCustomer({ variables: { billing: values } }).then((data) => {
        onSubmit();
      });
    },
    enableReinitialize: true,
  });

  return (
    <>
      <Typography gutterBottom variant="h3">
        Billing Address
      </Typography>
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
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
            onChange={formik.handleChange}
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
            onChange={formik.handleChange}
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
            onChange={formik.handleChange}
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
            onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
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
            onChange={formik.handleChange}
          />
        </FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {/* Phone */}
            <FormGroup>
              <TextField
                required
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
        <Box mt={2}>
          <Button type="submit" color="primary" loading={loading}>
            Continue to Shipping Address
          </Button>
        </Box>
      </form>
    </>
  );
};

export default BillingForm;
