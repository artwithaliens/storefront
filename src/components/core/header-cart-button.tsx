import { Cart } from '@components/icons';
import { IconButton } from '@components/ui';
import { Badge } from '@material-ui/core';
import React from 'react';
import { useCartQuery } from '../../graphql';

const HeaderCartButton: React.VFC = () => {
  const { data: { cart } = { cart: undefined } } = useCartQuery({
    fetchPolicy: 'no-cache',
    ssr: false,
  });

  return (
    <IconButton href="/cart" color="inherit" aria-label="Cart">
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={cart?.contents?.itemCount}
        color="primary"
      >
        <Cart />
      </Badge>
    </IconButton>
  );
};

export default HeaderCartButton;
