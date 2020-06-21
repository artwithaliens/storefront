export default function sentenceCase(str: string | null | undefined) {
  return (
    (str ?? '')
      .replace(/\s+\./g, '.') // Replace all dots with space infront
      .replace(/(^|>)\.\s+/g, '$1') // Remove all starting dots
      // Uppercase all sentences
      .replace(
        /(^|>|\.\s*)([a-z])/g,
        (_match, dot: string, char: string) => dot + char.toUpperCase(),
      )
  );
}
