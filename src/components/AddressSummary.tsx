import { makeStyles } from '@material-ui/core';
import React from 'react';
import countries from '../countryList';
import { CustomerAddressInput } from '../graphql';

const useStyles = makeStyles(
  ({ spacing, typography }) => ({
    root: {
      ...typography.body1,
      fontStyle: 'normal',
      marginBottom: spacing(2),

      '& strong': {
        display: 'inline-block',
        marginBottom: spacing(1),
      },
    },
  }),
  { name: 'AddressSummary' },
);

type Props = {
  address?: CustomerAddressInput | null;
  email?: string | null;
};

const AddressSummary: React.FC<Props> = ({ address, email }) => {
  const styles = useStyles();

  return address == null && email == null ? null : address == null ? (
    <address className={styles.root} translate="no">
      {email}
    </address>
  ) : (
    <address className={styles.root} translate="no">
      <strong>{`${address.firstName} ${address.lastName}`}</strong>
      <br />
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
          {countries[address.country]} <br />
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
    </address>
  );
};

export default AddressSummary;
