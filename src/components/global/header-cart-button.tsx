import { Badge, IconButton, SvgIcon } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import CartSvg from '../../assets/icons/cart.svg';
import { useCartQuery } from '../../graphql';

const HeaderCartButton: React.VFC = () => {
  const { data: { cart } = { cart: undefined } } = useCartQuery({ ssr: false });

  return (
    <Link passHref href="/cart">
      <IconButton aria-label="Cart">
        <Badge
          badgeContent={cart?.contents?.itemCount}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SvgIcon component={CartSvg} />
        </Badge>
      </IconButton>
    </Link>
  );
};

export default HeaderCartButton;
