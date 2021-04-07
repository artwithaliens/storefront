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

  const { control, formState, handleSubmit } = useForm<CreditCardFormData>({
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
        control={control}
        name="ccNumber"
        render={({ field }) => (
          <NumberFormat
            fullWidth
            required
            autoComplete="cc-number"
            customInput={TextField}
            error={'ccNumber' in formState.errors}
            format="#### #### #### ####"
            label="Number"
            margin="normal"
            {...field}
          />
        )}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="ccExp"
            render={({ field }) => (
              <NumberFormat
                fullWidth
                required
                autoComplete="cc-csc"
                customInput={TextField}
                error={'ccExp' in formState.errors}
                format="## / ##"
                label="Expiry date"
                margin="normal"
                {...field}
              />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            control={control}
            name="ccCsc"
            render={({ field }) => (
              <NumberFormat
                fullWidth
                required
                autoComplete="cc-csc"
                customInput={TextField}
                error={'ccCsc' in formState.errors}
                format="###"
                label="CVC"
                margin="normal"
                {...field}
              />
            )}
          />
        </Grid>
      </Grid>
    </form>
  );
});

export default CreditCardForm;
