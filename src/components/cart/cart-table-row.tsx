import { Image, Price } from '@components/core';
import { Delete } from '@components/icons';
import { IconButton, Link, QuantityInput } from '@components/ui';
import { Hidden, makeStyles, TableCell, TableRow, Typography } from '@material-ui/core';
import clsx from 'clsx';
import startCase from 'lodash/startCase';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../../graphql';

const useStyles = makeStyles(
  ({ breakpoints }) => ({
    root: {
      [breakpoints.down('sm')]: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    },

    loading: {
      '& td': {
        opacity: 0.45,
        position: 'relative',

        '&::after': {
          content: '""',
          height: '100%',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        },
      },
    },

    image: {
      boxSizing: 'content-box',
      width: 70,

      [breakpoints.down('sm')]: {
        borderBottom: 0,
        order: 1,
        paddingLeft: 0,
        paddingRight: 0,
      },

      '& img': {
        height: 'auto',
        width: '100%',
      },
    },

    description: {
      [breakpoints.down('sm')]: {
        borderBottom: 0,
        order: 2,
        width: 'calc(100% - 70px)',
      },
    },

    delete: {
      boxSizing: 'content-box',
      textAlign: 'center',
      width: 70,

      [breakpoints.down('sm')]: {
        borderBottom: 0,
        order: 3,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },

    price: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('sm')]: {
        borderBottom: 0,
        order: 4,
        textAlign: 'left',
        width: 'calc(50% - 70px)',
      },
    },

    quantity: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('sm')]: {
        borderBottom: 0,
        order: 5,
        width: '50%',
      },
    },

    total: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('sm')]: {
        order: 6,
        textAlign: 'right',
        width: '100%',
      },
    },
  }),
  { name: 'CartTableRow' },
);

type Props = {
  item: NonNullable<
    NonNullable<NonNullable<NonNullable<CartQuery['cart']>['contents']>['nodes']>[0]
  >;
  loading?: boolean;
  onUpdate?: (variables: UpdateCartMutationVariables) => void;
};

const CartTableRow: React.VFC<Props> = ({ item, loading, onUpdate }) => {
  const styles = useStyles({ loading });

  /**
   * When user changes the quantity from product input update the cart.
   *
   * @param value Value
   */
  const handleQuantityChange = (value: number) => {
    if (onUpdate != null) {
      onUpdate({ key: item.key, quantity: value });
    }
  };

  /**
   * Handle remove item.
   */
  const handleRemoveItem = () => {
    if (onUpdate != null) {
      onUpdate({ key: item.key, quantity: 0 });
    }
  };

  return (
    <TableRow className={clsx(styles.root, loading && styles.loading)}>
      <TableCell className={styles.image}>
        <Image mediaItem={item.product?.image} loading="lazy" />
      </TableCell>
      <TableCell className={styles.description}>
        <Typography gutterBottom variant="h5">
          <Link href={`/product/${item.product?.slug}`} underline="none">
            {item.product?.name}
          </Link>
        </Typography>
        <Typography gutterBottom variant="body2">
          SKU: {item.product?.sku ?? 'N/A'}
        </Typography>
        <Typography variant="body2">
          {item.variation?.attributes?.nodes?.map(
            (node) =>
              `${startCase(node?.name?.replace(/^pa_/, '') ?? 'Variation')}: ${node?.value}`,
          )}
        </Typography>
      </TableCell>
      <TableCell className={styles.price}>
        <Hidden smUp>
          <Typography variant="body2">Price:</Typography>
        </Hidden>
        {(item.product?.__typename === 'SimpleProduct' ||
          item.product?.__typename === 'VariableProduct') && <Price>{item.product.price}</Price>}
      </TableCell>
      <TableCell className={styles.quantity}>
        <QuantityInput
          value={item.quantity}
          disabled={loading}
          min={0}
          max={
            (item.product?.__typename === 'SimpleProduct'
              ? item.product.stockQuantity
              : item.product?.__typename === 'VariableProduct'
              ? item.variation?.stockQuantity
              : item.quantity) ?? undefined
          }
          onChange={handleQuantityChange}
        />
      </TableCell>
      <TableCell className={styles.total}>
        <Hidden smUp>
          <Typography variant="body2">Total Price:</Typography>
        </Hidden>
        <Price>{item.total}</Price>
      </TableCell>
      <TableCell className={styles.delete}>
        <IconButton aria-label="Delete" onClick={handleRemoveItem}>
          <Delete fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartTableRow;
