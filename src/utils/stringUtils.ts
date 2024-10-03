/**
 * Utility to safely get a field value, trim it, and replace empty values.
 * @param fields - The array of fields in a segment.
 * @param index - The field index to access.
 * @param defaultValue - The default value to use if field is empty.
 * @returns The trimmed field value or the default value.
 */
export function getField(fields: string[], index: number, defaultValue: string = ''): string {
  return (fields[index] ?? defaultValue).trim();
}
