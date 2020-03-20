import { Badge, IconButton, makeStyles, SvgIcon } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import { useCartQuery } from '../../graphql';
import CartSvg from '../../icons/cart.svg';

const useStyles = makeStyles(
  () => ({
    root: {
      //
    },

    badge: {
      fontSize: 12,
      fontWeight: 700,
      height: 16,
      minWidth: 16,
      padding: 2,
    },
  }),
  { name: 'CartButton' },
);

const CartButton: React.FC = () => {
  const styles = useStyles();
  const { data: { cart } = { cart: undefined } } = useCartQuery({ ssr: false });

  return (
    <Link passHref href="/cart">
      <IconButton className={styles.root} aria-label="Cart">
        <Badge
          badgeContent={cart?.contents?.itemCount}
          color="primary"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          classes={{ badge: styles.badge }}
        >
          <SvgIcon component={CartSvg} />
        </Badge>
      </IconButton>
    </Link>
  );
};

export default CartButton;
