import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import { CustomerAddressInput } from '../graphql';

export default function isShippingSameAsBilling(
  shipping?: CustomerAddressInput | null,
  billing?: CustomerAddressInput | null,
) {
  return (
    shipping?.firstName != null &&
    shipping?.lastName != null &&
    shipping?.address1 != null &&
    shipping?.city != null &&
    shipping?.postcode != null &&
    billing?.firstName != null &&
    billing?.lastName != null &&
    billing?.address1 != null &&
    billing?.city != null &&
    billing?.postcode != null &&
    isEqual(
      omit(shipping, ['email', 'overwrite', 'phone']),
      omit(billing, ['email', 'overwrite', 'phone']),
    )
  );
}
