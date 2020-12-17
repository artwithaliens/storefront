import {
  ExternalProduct,
  GroupProduct,
  SimpleProduct,
  StockStatusEnum,
  VariableProduct,
} from '../graphql';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export default function isProductOutOfStock(
  product: DeepPartial<ExternalProduct | GroupProduct | SimpleProduct | VariableProduct>,
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
