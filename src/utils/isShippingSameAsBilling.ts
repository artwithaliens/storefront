import { isEqual, omit } from 'lodash';
import { CustomerAddressInput } from '../graphql';

export default function isShippingSameAsBilling(
  shipping?: CustomerAddressInput | null,
  billing?: CustomerAddressInput | null,
) {
  return isEqual(
    omit(shipping, ['email', 'overwrite', 'phone']),
    omit(billing, ['email', 'overwrite', 'phone']),
  );
}
