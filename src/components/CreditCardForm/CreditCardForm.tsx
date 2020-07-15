import { Grid, TextField } from '@material-ui/core';
import { useFormik } from 'formik';
import React from 'react';
import NumberFormat from 'react-number-format';

export type CreditCardInput = {
  ccNumber: string;
  ccExp: string;
  ccCsc: string;
};

type Props = {
  formRef: React.RefObject<HTMLFormElement>;
  onSubmit: (values: CreditCardInput) => void;
};

const CreditCardForm: React.FC<Props> = ({ formRef, onSubmit }) => {
  const formik = useFormik<CreditCardInput>({
    initialValues: { ccNumber: '', ccExp: '', ccCsc: '' },
    onSubmit: (values, { setSubmitting }) => {
      onSubmit(values);
      setSubmitting(false);
    },
  });

  return (
    <form ref={formRef} onSubmit={formik.handleSubmit}>
      <NumberFormat
        fullWidth
        required
        customInput={TextField}
        label="Number"
        value={formik.values.ccNumber}
        format="#### #### #### ####"
        name="ccNumber"
        autoComplete="cc-number"
        error={'ccNumber' in formik.errors}
        margin="normal"
        onChange={formik.handleChange}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <NumberFormat
            fullWidth
            required
            customInput={TextField}
            label="Expiry date"
            value={formik.values.ccExp}
            format="## / ##"
            name="ccExp"
            autoComplete="cc-csc"
            error={'ccExp' in formik.errors}
            margin="normal"
            onChange={formik.handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberFormat
            fullWidth
            required
            customInput={TextField}
            label="CVC"
            value={formik.values.ccCsc}
            format="###"
            name="ccCsc"
            autoComplete="cc-csc"
            error={'ccCsc' in formik.errors}
            margin="normal"
            onChange={formik.handleChange}
          />
        </Grid>
      </Grid>
    </form>
  );
};

export default CreditCardForm;
