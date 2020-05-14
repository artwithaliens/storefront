import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';
import countries from '../countries';
import { CountriesEnum } from '../graphql';

function countryToFlag(isoCode: string) {
  return isoCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397));
}

type Props = {
  error?: boolean;
  helperText?: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
  value?: keyof typeof CountriesEnum | null;
};

const CountrySelect: React.FC<Props> = ({
  error,
  helperText,
  label,
  name,
  onChange,
  required,
  value,
}) => {
  const handleChange = (_event: React.ChangeEvent<{}>, newValue: typeof countries[0] | null) => {
    if (onChange != null) {
      onChange(newValue?.code ?? '');
    }
  };

  return (
    <Autocomplete
      autoHighlight
      disableClearable
      options={countries}
      defaultValue={countries.find((country) => country.code === value)}
      getOptionSelected={(option) => option.code === value}
      getOptionLabel={(option) => option.label}
      renderOption={(option) => (
        <>
          <span>{countryToFlag(option.code)}</span>
          {option.label} ({option.code})
        </>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          error={error}
          helperText={helperText}
          label={label}
          name={name}
          required={required}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
      onChange={handleChange}
    />
  );
};

export default CountrySelect;
