import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import mapValues from 'lodash/mapValues';
import uniq from 'lodash/uniq';
import { PartialDeep } from 'type-fest';
import { VariableProduct } from '../graphql';

export default function getVariations(product: PartialDeep<VariableProduct>) {
  const varationAttributes =
    product.variations?.nodes?.flatMap(
      (variation) =>
        variation?.attributes?.nodes?.map((attribute) =>
          attribute != null
            ? {
                ...attribute,
                variationId: variation.databaseId,
              }
            : undefined,
        ) ?? [],
    ) ?? [];

  return mapValues(groupBy(varationAttributes, 'name'), (attribute) => ({
    label: attribute[0]?.label,
    name: attribute[0]?.name,
    options: uniq(map(attribute, 'value')),
  }));
}
