import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../../graphql';
import Price from '../Price';
import CartItem from './CartItem';

type Props = {
  cart: NonNullable<CartQuery['cart']>;
  loading?: boolean;
  onUpdate?: (values: UpdateCartMutationVariables) => void;
};

const CartTable: React.FC<Props> = ({ cart, loading, onUpdate }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell scope="col" colSpan={2}>
          Product
        </TableCell>
        <TableCell scope="col">Price</TableCell>
        <TableCell scope="col" align="center">
          Quantity
        </TableCell>
        <TableCell scope="col">Total Price</TableCell>
        <TableCell scope="col" />
      </TableRow>
    </TableHead>
    <TableBody>
      {cart.contents?.nodes?.map(
        (item) =>
          item != null && (
            <CartItem key={item.key} item={item} loading={loading} onUpdate={onUpdate} />
          ),
      )}
      <TableRow>
        <TableCell colSpan={4}>
          <Typography>Subtotal</Typography>
        </TableCell>
        <TableCell colSpan={2}>
          <Price>{cart.contentsTotal}</Price>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

export default CartTable;
