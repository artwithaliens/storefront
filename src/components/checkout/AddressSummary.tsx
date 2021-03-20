import { Typography } from '@material-ui/core';
import React from 'react';
import countries from '../../countries';
import { CustomerAddressInput } from '../../graphql';

type Props = {
  address?: CustomerAddressInput | null;
  email?: string | null;
};

const AddressSummary: React.VFC<Props> = ({ address, email }) => (
  <Typography gutterBottom component="address" translate="no" sx={{ fontStyle: 'normal' }}>
    {address == null && email == null ? null : address == null ? (
      email
    ) : (
      <>
        <Typography variant="inherit" sx={{ fontWeight: 'bold', mb: 1 }}>
          {address.firstName} {address.lastName}
        </Typography>
        {address.company != null && (
          <>
            {address.company} <br />
          </>
        )}
        {address.address1}
        <br />
        {address.address2 != null && (
          <>
            {address.address2} <br />
          </>
        )}
        {address.city}, {address.postcode}
        <br />
        {address.state != null && (
          <>
            {address.state} <br />
          </>
        )}
        {address.country != null && (
          <>
            {countries.find((country) => country.code === address.country)?.label} <br />
          </>
        )}
        {address.phone != null && (
          <>
            Phone number: {address.phone} <br />
          </>
        )}
        {address.email != null && (
          <>
            {address.email} <br />
          </>
        )}
      </>
    )}
  </Typography>
);

export default AddressSummary;
