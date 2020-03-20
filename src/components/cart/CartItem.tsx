import {
  IconButton,
  makeStyles,
  SvgIcon,
  TableCell,
  TableRow,
  Theme,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { startCase } from 'lodash';
import React from 'react';
import { CartQuery, UpdateCartMutationVariables } from '../../graphql';
import DeleteSvg from '../../icons/delete.svg';
import Price from '../Price';
import QuantityInput from '../QuantityInput';

const useStyles = makeStyles(
  {
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
  },
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
  const styles = useStyles();
  const matches = useMediaQuery<Theme>((theme) => theme.breakpoints.up('sm'));

  const editable = onUpdate != null;

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
    <TableRow className={loading ? styles.loading : undefined}>
      {matches && (
        <TableCell>
          <img
            width="64"
            src={item.product?.image?.sourceUrl ?? undefined}
            srcSet={item.product?.image?.srcSet ?? undefined}
            alt={item.product?.image?.altText ?? ''}
          />
        </TableCell>
      )}
      <TableCell colSpan={matches ? undefined : 2}>
        <Typography>{item.product?.name}</Typography>
        <Typography variant="body2">
          {item.variation?.attributes?.nodes?.map(
            (node) => `${startCase(node?.name ?? 'Variation')}: ${node?.value}`,
          )}
        </Typography>
      </TableCell>
      <TableCell>
        {(item.product?.__typename === 'SimpleProduct' ||
          item.product?.__typename === 'VariableProduct') && <Price>{item.product.price}</Price>}
      </TableCell>
      <TableCell align="center">
        {editable ? (
          <QuantityInput
            value={item.quantity}
            disabled={loading}
            min={1}
            max={
              (item.product?.__typename === 'SimpleProduct'
                ? item.product.stockQuantity
                : item.product?.__typename === 'VariableProduct'
                ? item.variation?.stockQuantity
                : item.quantity) ?? undefined
            }
            onChange={handleQuantityChange}
          />
        ) : (
          item.quantity
        )}
      </TableCell>
      <TableCell colSpan={editable ? undefined : 2}>
        <Price>{item.total}</Price>
      </TableCell>
      {editable && (
        <TableCell align="center">
          <IconButton aria-label="Delete" onClick={handleRemoveItem}>
            <SvgIcon component={DeleteSvg} fontSize="small" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

export default CartItem;
