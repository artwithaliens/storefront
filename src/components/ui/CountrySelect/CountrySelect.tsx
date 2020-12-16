import { TextField, TextFieldProps } from '@material-ui/core';
import React from 'react';
import countries from '../../../countries';
import { CountriesEnum } from '../../../graphql';

function countryToFlag(isoCode: string) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

export type CountrySelectProps = Omit<TextFieldProps, 'value'> & {
  value?: keyof typeof CountriesEnum | null;
};

const CountrySelect: React.VFC<CountrySelectProps> = ({ value, ...props }) => (
  <TextField
    {...props}
    select
    value={value}
    SelectProps={{
      native: true,
    }}
  >
    {countries.map((country) => (
      <option value={country.code}>
        {country.label} {countryToFlag(country.code)}
      </option>
    ))}
  </TextField>
);

export default CountrySelect;
