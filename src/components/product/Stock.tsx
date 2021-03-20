import { Typography } from '@material-ui/core';
import React from 'react';
import { PartialDeep } from 'type-fest';
import { ProductVariation, SimpleProduct, StockStatusEnum, VariableProduct } from '../../graphql';
import isBlank from '../../utils/isBlank';

type Props = {
  product?: PartialDeep<SimpleProduct | VariableProduct>;
  variation?: Partial<ProductVariation> | null;
};

const Stock: React.FC<Props> = ({ product, variation }) =>
  (product?.__typename === 'SimpleProduct' && product.stockStatus === StockStatusEnum.IN_STOCK) ||
  variation?.stockStatus === StockStatusEnum.IN_STOCK ? (
    <>
      <Typography gutterBottom variant="body2">
        Deliverable in {isBlank(product?.deliveryTime) ? '2-3 working days' : product?.deliveryTime}
      </Typography>
      <Typography gutterBottom color="primary" variant="h5">
        In stock
      </Typography>
    </>
  ) : product?.stockStatus === StockStatusEnum.OUT_OF_STOCK ||
    variation?.stockStatus === StockStatusEnum.OUT_OF_STOCK ? (
    <Typography gutterBottom color="error" variant="h5">
      Out of stock
    </Typography>
  ) : variation?.stockStatus === StockStatusEnum.ON_BACKORDER ? (
    <Typography gutterBottom color="primary" variant="h5">
      Available on backorder
    </Typography>
  ) : null;

export default Stock;
