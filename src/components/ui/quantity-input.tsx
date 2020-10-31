import { IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import { useCounter, useUpdateEffect } from 'react-use';
import { Minus, Plus } from '../icons';

const useStyles = makeStyles(
  ({ spacing }) => ({
    root: {
      display: 'inline-flex',
      alignItems: 'center',
    },

    value: {
      margin: spacing(0, 1),
    },
  }),
  { name: 'QuantityInput' },
);

type Props = {
  disabled?: boolean;
  max?: number;
  min?: number;
  onChange: (value: number) => void;
  value: number | null | undefined;
};

const QuantityInput: React.VFC<Props> = ({
  disabled,
  max = Infinity,
  min = 0,
  onChange,
  value: initialValue,
}) => {
  const styles = useStyles();
  const [value, { inc, dec }] = useCounter(initialValue ?? 0, max, min);

  useUpdateEffect(() => {
    onChange(value);
  }, [value]);

  return (
    <div className={styles.root}>
      <IconButton
        aria-label="Minus"
        size="small"
        disabled={disabled || value === min}
        onClick={() => dec()}
      >
        <Minus fontSize="inherit" />
      </IconButton>
      <div className={styles.value}>{value}</div>
      <IconButton
        aria-label="Plus"
        size="small"
        disabled={disabled || value === max}
        onClick={() => inc()}
      >
        <Plus fontSize="inherit" />
      </IconButton>
    </div>
  );
};

export default QuantityInput;
