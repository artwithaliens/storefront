import { TextField, TextFieldProps } from '@material-ui/core';
import React from 'react';
import countries from '../../../countries';
import { CountriesEnum } from '../../../graphql';

function countryToFlag(isoCode: string) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127_397));
}

export type CountrySelectProps = Omit<TextFieldProps, 'defaultValue' | 'select'> & {
  defaultValue?: keyof typeof CountriesEnum | null;
};

const CountrySelect = React.forwardRef<HTMLDivElement, CountrySelectProps>((props, ref) => (
  <TextField
    ref={ref}
    {...props}
    select
    SelectProps={{
      native: true,
    }}
  >
    {countries.map((country) => (
      <option key={country.code} value={country.code}>
        {country.label} {countryToFlag(country.code)}
      </option>
    ))}
  </TextField>
));

export default CountrySelect;
