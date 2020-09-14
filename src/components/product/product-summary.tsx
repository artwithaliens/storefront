import { Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery, StockStatusEnum } from '../../graphql';
import isBlank from '../../utils/is-blank';
import Link from '../global/link';
import Price from '../global/price';
import RichText from '../global/rich-text';

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
      plus{' '}
      <Link href="/[slug]" as="/shipping-costs">
        Shipping Costs
      </Link>
    </Typography>
    <RichText>
      {isBlank(product.shortDescription) ? product.description : product.shortDescription}
    </RichText>
    {product.__typename === 'SimpleProduct' &&
    product.stockStatus === StockStatusEnum.OUT_OF_STOCK ? (
      <Typography gutterBottom color="error" variant="h5">
        Sold out
      </Typography>
    ) : (
      <Typography gutterBottom variant="body2">
        Deliverable in {isBlank(product.deliveryTime) ? '2-3 working days' : product.deliveryTime}
      </Typography>
    )}
  </>
);

export default ProductSummary;
