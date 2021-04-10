import { Image } from '@components/core';
import { Delete } from '@components/icons';
import { IconButton, Link, Price, QuantityInput } from '@components/ui';
import { Hidden, TableCell, TableRow, Typography } from '@material-ui/core';
import startCase from 'lodash/startCase';
import React from 'react';
import { CartQuery, StockStatusEnum, UpdateCartMutationVariables } from '../../graphql';

type Props = {
  item: NonNullable<
    NonNullable<NonNullable<NonNullable<CartQuery['cart']>['contents']>['nodes']>[0]
  >;
  loading?: boolean;
  onUpdate?: (variables: UpdateCartMutationVariables) => void;
};

const CartTableRow: React.VFC<Props> = ({ item, loading, onUpdate }) => {
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
    <TableRow
      sx={{
        display: ['flex', 'table-row'],
        flexWrap: 'wrap',

        ...(loading && {
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
        }),
      }}
    >
      <TableCell
        sx={{
          borderBottomWidth: { xs: 0, sm: 1 },
          boxSizing: 'content-box',
          order: 1,
          px: { xs: 0, sm: 2 },
          width: 64,

          '& img': {
            height: 'auto',
            width: '100%',
          },
        }}
      >
        <Image height={80} loading="lazy" mediaItem={item.product?.node?.image} width={64} />
      </TableCell>
      <TableCell
        sx={{
          borderBottomWidth: { xs: 0, sm: 1 },
          order: 2,
          width: { xs: 'calc(100% - 70px)', sm: 'auto' },
        }}
      >
        <Typography gutterBottom variant="h5">
          <Link href={`/product/${item.product?.node?.slug}`} underline="none">
            {item.product?.node?.name}
          </Link>
        </Typography>
        <Typography gutterBottom variant="body2">
          SKU: {item.product?.node?.sku ?? 'N/A'}
        </Typography>
        <Typography variant="body2">
          {item.variation?.node?.attributes?.nodes?.map(
            (node) =>
              `${startCase(node?.name?.replace(/^pa_/, '') ?? 'Variation')}: ${node?.value}`,
          )}
        </Typography>
      </TableCell>
      <TableCell
        sx={{
          borderBottomWidth: { xs: 0, sm: 1 },
          order: 4,
          textAlign: { xs: 'left', sm: 'center' },
          width: { xs: 'calc(50% - 70px)', sm: '15%' },
        }}
      >
        <Hidden smUp>
          <Typography variant="body2">Price:</Typography>
        </Hidden>
        {(item.product?.node?.__typename === 'SimpleProduct' ||
          item.product?.node?.__typename === 'VariableProduct') && (
          <Price>{item.product.node.price}</Price>
        )}
      </TableCell>
      <TableCell
        align="center"
        sx={{
          borderBottomWidth: { xs: 0, sm: 1 },
          order: 5,
          width: { xs: '50%', sm: '15%' },
        }}
      >
        <QuantityInput
          value={item.quantity}
          disabled={loading}
          min={0}
          max={
            (item.product?.node?.__typename === 'SimpleProduct'
              ? item.product.node.stockStatus === StockStatusEnum.IN_STOCK
                ? item.product.node.stockQuantity
                : 999
              : item.product?.node?.__typename === 'VariableProduct'
              ? item.variation?.node?.stockStatus === StockStatusEnum.IN_STOCK
                ? item.variation.node.stockQuantity
                : 999
              : item.quantity) ?? undefined
          }
          onChange={handleQuantityChange}
        />
      </TableCell>
      <TableCell
        sx={{
          order: 6,
          textAlign: { xs: 'right', sm: 'center' },
          width: { xs: '100%', sm: '15%' },
        }}
      >
        <Hidden smUp>
          <Typography variant="body2">Total Price:</Typography>
        </Hidden>
        <Price>{item.subtotal}</Price>
      </TableCell>
      <TableCell
        align="center"
        sx={{
          borderBottomWidth: { xs: 0, sm: 1 },
          order: 3,
          px: { xs: 0, sm: 2 },
          width: 64,
        }}
      >
        <IconButton aria-label="Delete" onClick={handleRemoveItem}>
          <Delete />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartTableRow;
