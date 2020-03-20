import { Icon, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import { useCounter } from 'react-use';

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

const QuantityInput: React.FC<Props> = ({
  disabled,
  max = Infinity,
  min = 1,
  onChange,
  value: initialValue,
}) => {
  const styles = useStyles();
  const [value, { inc, dec }] = useCounter(initialValue ?? 0, max, min);

  const handleDecrement = () => {
    dec();
    onChange(value);
  };

  const handleIncrement = () => {
    inc();
    onChange(value);
  };

  return (
    <div className={styles.root}>
      <IconButton
        aria-label="Minus"
        size="small"
        disabled={disabled || value === min}
        onClick={handleDecrement}
      >
        <Icon className="fas fa-minus" fontSize="inherit" />
      </IconButton>
      <div className={styles.value}>{value}</div>
      <IconButton
        aria-label="Plus"
        size="small"
        disabled={disabled || value === max}
        onClick={handleIncrement}
      >
        <Icon className="fas fa-plus" fontSize="inherit" />
      </IconButton>
    </div>
  );
};

export default QuantityInput;
