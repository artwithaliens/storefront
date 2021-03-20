import { ProductJsonLd } from 'next-seo';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { ProductQuery, StockStatusEnum } from '../../graphql';
import absoluteURL from '../../utils/absoluteURL';
import { SettingsContext } from '../core/settings-provider';

type Props = {
  product: ProductQuery['product'];
};

const ProductJSON: React.VFC<Props> = ({ product }) => {
  const router = useRouter();
  const settings = useContext(SettingsContext);

  return (
    <ProductJsonLd
      productName={product?.name ?? ''}
      images={
        [product?.image?.sourceUrl]
          .concat(product?.galleryImages?.nodes?.map((mediaItem) => mediaItem?.sourceUrl))
          .filter((sourceUrl) => sourceUrl != null) as string[]
      }
      description={product?.seo?.description ?? ''}
      offers={
        product?.__typename === 'SimpleProduct'
          ? {
              price: product.price ?? '0',
              priceCurrency: 'EUR',
              itemCondition: 'https://schema.org/NewCondition',
              availability:
                product.stockStatus === StockStatusEnum.OUT_OF_STOCK
                  ? 'http://schema.org/OutOfStock'
                  : product.stockStatus === StockStatusEnum.IN_STOCK
                  ? 'http://schema.org/InStock'
                  : product.stockStatus === StockStatusEnum.ON_BACKORDER
                  ? 'http://schema.org/PreOrder'
                  : undefined,
              url: absoluteURL(router.asPath),
              seller: {
                name: settings.title,
              },
            }
          : undefined
      }
    />
  );
};

export default ProductJSON;
