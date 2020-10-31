import { Price } from '@components/core';
import {
  alpha,
  darken,
  Hidden,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../../graphql';
import CartTableRow from './cart-table-row';

const useStyles = makeStyles(
  ({ breakpoints, palette }) => ({
    root: {
      borderTop: `1px solid ${darken(alpha(palette.divider, 1), 0.68)}`,
      display: 'block',

      [breakpoints.up('sm')]: {
        borderTop: 0,
        display: 'table',
      },
    },

    body: {
      display: 'block',

      [breakpoints.up('sm')]: {
        display: 'table-row-group',
      },
    },

    footer: {
      display: 'block',

      [breakpoints.up('sm')]: {
        display: 'table-footer-group',
      },

      '& tr': {
        display: 'flex',

        [breakpoints.up('sm')]: {
          display: 'table-row',
        },
      },

      '& td': {
        '&:nth-of-type(n+2)': {
          flexGrow: 1,
        },

        '&:nth-of-type(3)': {
          textAlign: 'right',

          [breakpoints.up('sm')]: {
            textAlign: 'left',
          },
        },
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

const CartTable: React.VFC<Props> = ({ cart, loading, onUpdate }) => {
  const styles = useStyles();

  return (
    <Table className={styles.root}>
      <Hidden smDown>
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>Product</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell colSpan={2}>Total Price</TableCell>
          </TableRow>
        </TableHead>
      </Hidden>
      <TableBody className={styles.body}>
        {cart.contents?.nodes?.map(
          (item) =>
            item != null && (
              <CartTableRow key={item.key} item={item} loading={loading} onUpdate={onUpdate} />
            ),
        )}
      </TableBody>
      <TableFooter className={styles.footer}>
        <TableRow>
          <TableCell colSpan={3} />
          <TableCell>
            <Typography>Subtotal</Typography>
          </TableCell>
          <TableCell colSpan={2}>
            <Price>{cart.contentsTotal}</Price>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default CartTable;
