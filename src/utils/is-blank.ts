export default function isBlank(value: string | null | undefined): value is null | undefined | '' {
  return value == null || value?.trim() === '';
}
