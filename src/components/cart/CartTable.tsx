import {
  darken,
  fade, Hidden,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../../graphql';
import Price from '../Price';
import CartItem from './CartItem';

const useStyles = makeStyles(
  ({ breakpoints, palette }) => ({
    root: {
      display: 'table',

      [breakpoints.down('xs')]: {
        borderTop: `1px solid ${darken(fade(palette.divider, 1), 0.68)}`,
        display: 'block',
      },
    },

    body: {
      [breakpoints.down('xs')]: {
        display: 'block',
      },
    },

    totalsTitle: {
      [breakpoints.down('xs')]: {
        width: '50%',
      },
    },

    totalsValue: {
      [breakpoints.down('xs')]: {
        textAlign: 'right',
        width: '50%',
      },
    },
  }),
  { name: 'CartTable' },
);

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  loading?: boolean;
  onUpdate?: (values: UpdateCartMutationVariables) => void;
};

const CartTable: React.FC<Props> = ({ cart, loading, onUpdate }) => {
  const styles = useStyles();

  return (
    <Table className={styles.root}>
      <Hidden xsDown>
        <TableHead>
          <TableRow>
            <TableCell scope="col" colSpan={2}>
              Product
            </TableCell>
            <TableCell scope="col">Price</TableCell>
            <TableCell scope="col">Quantity</TableCell>
            <TableCell scope="col">Total Price</TableCell>
            <TableCell scope="col" />
          </TableRow>
        </TableHead>
      </Hidden>
      <TableBody className={styles.body}>
        {cart.contents?.nodes?.map(
          (item) =>
            item != null && (
              <CartItem key={item.key} item={item} loading={loading} onUpdate={onUpdate} />
            ),
        )}
        <TableRow>
          <TableCell colSpan={3} />
          <TableCell className={styles.totalsTitle}>
            <Typography>Subtotal</Typography>
          </TableCell>
          <TableCell colSpan={2} className={styles.totalsValue}>
            <Price>{cart.contentsTotal}</Price>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default CartTable;
