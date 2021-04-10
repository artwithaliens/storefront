import { RichText } from '@components/core';
import { Link, Price } from '@components/ui';
import { Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery } from '../../graphql';
import isBlank from '../../utils/isBlank';

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductSummary: React.VFC<Props> = ({ product }) => (
  <>
    <Typography gutterBottom component="h1" variant="h2">
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
  </>
);

export default ProductSummary;
