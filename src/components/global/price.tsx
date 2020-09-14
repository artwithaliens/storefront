import { Typography } from '@material-ui/core';
import React from 'react';

type Props = {
  children: string | null | undefined;
  color?: 'inherit' | 'primary' | 'textPrimary' | 'textSecondary';
  component?: 'p' | 'span';
  variant?: 'body1' | 'h5' | 'h4' | 'h3';
};

const Price: React.FC<Props> = ({
  children,
  color = 'textSecondary',
  component = 'p',
  variant = 'body1',
}) => (
  <Typography color={color} component={component} variant={variant}>
    {children == null
      ? '-'
      : parseFloat(children).toLocaleString(undefined, {
          style: 'currency',
          currency: 'EUR',
        })}
  </Typography>
);

export default Price;
