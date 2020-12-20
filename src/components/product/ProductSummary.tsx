import { Price, RichText } from '@components/core';
import { Link } from '@components/ui';
import { Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery } from '../../graphql';
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
    {!isProductOutOfStock(product) && (
      <Typography gutterBottom variant="body2">
        Deliverable in {isBlank(product.deliveryTime) ? '2-3 working days' : product.deliveryTime}
      </Typography>
    )}
  </>
);

export default ProductSummary;
