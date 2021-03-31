import { Grid, TextField } from '@material-ui/core';
import React, { useImperativeHandle, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import NumberFormat from 'react-number-format';

export type CreditCardFormData = {
  ccNumber: string;
  ccExp: string;
  ccCsc: string;
};

type Props = {
  onSubmit: (values: CreditCardFormData) => void;
};

const CreditCardForm = React.forwardRef<HTMLFormElement, Props>(({ onSubmit }, ref) => {
  const innerRef = useRef<HTMLFormElement>(null);

  const { control, errors, handleSubmit } = useForm<CreditCardFormData>({
    defaultValues: { ccNumber: '', ccExp: '', ccCsc: '' },
  });

  // Override standard form methods, this works for now:
  useImperativeHandle(ref, () => ({
    ...(innerRef.current ?? new HTMLFormElement()),
    checkValidity: () => innerRef.current?.checkValidity() ?? false,
    reportValidity: () => innerRef.current?.reportValidity() ?? false,
    submit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  return (
    <form ref={innerRef} onSubmit={handleSubmit(onSubmit)}>
      <Controller
        fullWidth
        required
        as={NumberFormat}
        autoComplete="cc-number"
        control={control}
        customInput={TextField}
        error={'ccNumber' in errors}
        format="#### #### #### ####"
        label="Number"
        margin="normal"
        name="ccNumber"
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            fullWidth
            required
            as={NumberFormat}
            autoComplete="cc-csc"
            control={control}
            customInput={TextField}
            error={'ccExp' in errors}
            format="## / ##"
            label="Expiry date"
            margin="normal"
            name="ccExp"
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            fullWidth
            required
            as={NumberFormat}
            autoComplete="cc-csc"
            control={control}
            customInput={TextField}
            error={'ccCsc' in errors}
            format="###"
            label="CVC"
            margin="normal"
            name="ccCsc"
          />
        </Grid>
      </Grid>
    </form>
  );
});

export default CreditCardForm;
