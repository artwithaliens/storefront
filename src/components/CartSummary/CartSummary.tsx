import {
  darken,
  fade,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { CartQuery } from '../../graphql';
import Price from '../Price';

const useStyles = makeStyles(
  ({ palette, spacing }) => ({
    root: {
      padding: spacing(3),
    },

    table: {
      borderTop: `1px solid ${darken(fade(palette.divider, 1), 0.68)}`,
    },

    tableRow: {
      '& td:first-of-type': {
        paddingLeft: 0,
      },

      '& td:last-of-type': {
        paddingRight: 0,
      },
    },

    total: {
      fontSize: 16,
    },
  }),
  { name: 'CartSummary' },
);

type Props = {
  cart: NonNullable<CartQuery['cart']>;
};

const CartSummary: React.FC<Props> = ({ cart }) => {
  const styles = useStyles();

  return (
    <Paper className={styles.root}>
      <Typography gutterBottom variant="h4">
        Cart summary
      </Typography>
      <Table className={styles.table}>
        <TableBody>
          {cart.contents?.nodes?.map(
            (item) =>
              item != null && (
                <TableRow key={item.key} className={styles.tableRow}>
                  <TableCell>
                    <img
                      src={item.product?.image?.sourceUrl ?? undefined}
                      srcSet={item.product?.image?.srcSet ?? undefined}
                      sizes={item.product?.image?.sizes ?? undefined}
                      alt={item.product?.image?.altText ?? ''}
                      loading="lazy"
                      width="64"
                    />
                  </TableCell>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>
                    <Price>{item.total}</Price>
                  </TableCell>
                </TableRow>
              ),
          )}
          <TableRow className={styles.tableRow}>
            <TableCell className={styles.total} colSpan={2}>
              Subtotal
            </TableCell>
            <TableCell className={styles.total}>
              <Price>{cart.subtotal}</Price>
            </TableCell>
          </TableRow>
          <TableRow className={styles.tableRow}>
            <TableCell className={styles.total} colSpan={2}>
              Shipping
            </TableCell>
            <TableCell className={styles.total}>
              <Price>
                {
                  cart.availableShippingMethods?.[0]?.rates?.find(
                    (rate) => rate?.id === cart.chosenShippingMethod,
                  )?.cost
                }
              </Price>
            </TableCell>
          </TableRow>
          <TableRow className={styles.tableRow}>
            <TableCell className={styles.total} colSpan={2}>
              Total
            </TableCell>
            <TableCell className={styles.total}>
              <Price>{cart.total}</Price>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CartSummary;
