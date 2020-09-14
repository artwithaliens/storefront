import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { ProductQuery } from '../../graphql';
import Link from '../global/link';

type Props = {
  product: NonNullable<ProductQuery['product']>;
};

const ProductMeta: React.FC<Props> = ({ product }) => (
  <Box mt={2}>
    <Typography>SKU: {product.sku ?? 'N/A'}</Typography>
    {(product.productCategories?.nodes?.length ?? 0) > 0 && (
      <Typography>
        Categories:{' '}
        {product?.productCategories?.nodes?.map(
          (category, i) =>
            category != null && [
              i > 0 && ', ',
              <Link
                key={category.id}
                href="/product-category/[slug]"
                as={`/product-category/${category.slug}`}
              >
                {category.name}
              </Link>,
            ],
        )}
      </Typography>
    )}
    {(product.productTags?.nodes?.length ?? 0) > 0 && (
      <Typography>
        Tags:{' '}
        {product.productTags?.nodes?.map(
          (tag, i) =>
            tag != null && [
              i > 0 && ', ',
              <Link key={tag.id} href="/product-tag/[slug]" as={`/product-tag/${tag.slug}`}>
                {tag.name}
              </Link>,
            ],
        )}
      </Typography>
    )}
  </Box>
);

export default ProductMeta;
