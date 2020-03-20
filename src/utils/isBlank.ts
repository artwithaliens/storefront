import { isEmpty } from 'lodash';

export default function isBlank(value?: string | null): value is null | undefined | '' {
  return isEmpty(value?.trim());
}
