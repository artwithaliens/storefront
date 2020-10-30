import {
  alpha,
  Box,
  darken,
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
import Image from '../global/image';
import Price from '../global/price';

const useStyles = makeStyles(
  ({ palette }) => ({
    table: {
      borderTop: `1px solid ${darken(alpha(palette.divider, 1), 0.68)}`,
    },

    tableRow: {
      '& td:first-of-type': {
        paddingLeft: 0,
      },

      '& td:last-of-type': {
        paddingRight: 0,
      },
    },

    image: {
      height: 'auto',
      width: 64,
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

const CartSummary: React.VFC<Props> = ({ cart }) => {
  const styles = useStyles();

  return (
    <Paper>
      <Box sx={{ p: 3 }}>
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
                      <Image
                        className={styles.image}
                        mediaItem={item.product?.image}
                        loading="lazy"
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
      </Box>
    </Paper>
  );
};

export default CartSummary;
