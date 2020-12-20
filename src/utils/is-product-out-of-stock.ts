import { PartialDeep } from 'type-fest';
import {
  ExternalProduct,
  GroupProduct,
  SimpleProduct,
  StockStatusEnum,
  VariableProduct,
} from '../graphql';

export default function isProductOutOfStock(
  product: PartialDeep<ExternalProduct | GroupProduct | SimpleProduct | VariableProduct>,
) {
  return (
    (product.__typename === 'SimpleProduct' &&
      product.stockStatus === StockStatusEnum.OUT_OF_STOCK) ||
    (product.__typename === 'VariableProduct' &&
      product.variations?.nodes?.every?.(
        (variation) => variation?.stockStatus === StockStatusEnum.OUT_OF_STOCK,
      ))
  );
}
