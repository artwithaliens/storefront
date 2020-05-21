import {
  Hidden,
  IconButton,
  makeStyles,
  SvgIcon,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { startCase } from 'lodash';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../graphql';
import DeleteSvg from '../icons/delete.svg';
import Price from './Price';
import QuantityInput from './QuantityInput';

const useStyles = makeStyles(
  ({ breakpoints }) => ({
    root: {
      [breakpoints.down('xs')]: {
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

      [breakpoints.down('xs')]: {
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
      [breakpoints.down('xs')]: {
        borderBottom: 0,
        order: 2,
        width: 'calc(100% - 70px)',
      },
    },

    delete: {
      boxSizing: 'content-box',
      textAlign: 'center',
      width: 70,

      [breakpoints.down('xs')]: {
        borderBottom: 0,
        order: 3,
        paddingLeft: 0,
        paddingRight: 0,
      },
    },

    price: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('xs')]: {
        borderBottom: 0,
        order: 4,
        textAlign: 'left',
        width: 'calc(50% - 70px)',
      },
    },

    quantity: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('xs')]: {
        borderBottom: 0,
        order: 5,
        width: '50%',
      },
    },

    total: {
      textAlign: 'center',
      width: '15%',

      [breakpoints.down('xs')]: {
        order: 6,
        textAlign: 'right',
        width: '100%',
      },
    },
  }),
  { name: 'CartItem' },
);

type Props = {
  item: NonNullable<
    NonNullable<NonNullable<NonNullable<CartQuery['cart']>['contents']>['nodes']>[0]
  >;
  loading?: boolean;
  onUpdate?: (variables: UpdateCartMutationVariables) => void;
};

const CartItem: React.FC<Props> = ({ item, loading, onUpdate }) => {
  const styles = useStyles({ loading });

  /**
   * When user changes the quantity from product input update the cart.
   *
   * @param value Value
   */
  const handleQuantityChange = (value: number) => {
    if (onUpdate != null) {
      onUpdate({
        key: item.key,
        quantity: value,
      });
    }
  };

  /**
   * Handle remove item.
   *
   * @param key Cart item key
   */
  const handleRemoveItem = () => {
    if (onUpdate != null) {
      onUpdate({ key: item.key, quantity: 0 });
    }
  };

  return (
    <TableRow className={clsx(styles.root, loading && styles.loading)}>
      <TableCell className={styles.image}>
        <img
          src={item.product?.image?.sourceUrl ?? undefined}
          srcSet={item.product?.image?.srcSet ?? undefined}
          alt={item.product?.image?.altText ?? ''}
        />
      </TableCell>
      <TableCell className={styles.description}>
        <Typography gutterBottom variant="h5">
          {item.product?.name}
        </Typography>
        <Typography gutterBottom variant="body2">
          SKU: {item.product?.sku ?? 'N/A'}
        </Typography>
        <Typography variant="body2">
          {item.variation?.attributes?.nodes?.map(
            (node) => `${startCase(node?.name ?? 'Variation')}: ${node?.value}`,
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
          <SvgIcon component={DeleteSvg} fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
