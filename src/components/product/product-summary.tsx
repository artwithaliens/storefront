import { Price, RichText } from '@components/core';
import { Link } from '@components/ui';
import { Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery, StockStatusEnum } from '../../graphql';
import isBlank from '../../utils/is-blank';
import isProductOutOfStock from '../../utils/is-product-out-of-stock';

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductSummary: React.VFC<Props> = ({ product }) => (
  <>
    <Typography component="h1" variant="h2">
      {product.name}
    </Typography>
    {(product.__typename === 'SimpleProduct' ||
      product.__typename === 'VariableProduct' ||
      product.__typename === 'ExternalProduct') && (
      <Price color="primary" variant="h3">
        {product.price}
      </Price>
    )}
    <Typography gutterBottom variant="body2">
      plus <Link href="/shipping-costs">Shipping Costs</Link>
    </Typography>
    <RichText>
      {isBlank(product.shortDescription) ? product.description : product.shortDescription}
    </RichText>
    {isProductOutOfStock(product) ? (
      <Typography gutterBottom color="error" variant="h5">
        Sold out
      </Typography>
    ) : (product.__typename === 'SimpleProduct' &&
        product.stockStatus === StockStatusEnum.ON_BACKORDER) ||
      (product.__typename === 'VariableProduct' &&
        product.variations?.nodes?.some?.(
          (variation) => variation?.stockStatus === StockStatusEnum.ON_BACKORDER,
        )) ? (
      <Typography gutterBottom variant="h5">
        Preorder now
      </Typography>
    ) : (
      <Typography gutterBottom variant="body2">
        Deliverable in {isBlank(product.deliveryTime) ? '2-3 working days' : product.deliveryTime}
      </Typography>
    )}
  </>
);

export default ProductSummary;
