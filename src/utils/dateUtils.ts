/**
 * Validates if a given date string (YYYY-MM-DD) is a valid date.
 * @param dateStr - The date string in 'YYYY-MM-DD' format.
 * @returns true if valid, false otherwise.
 */
export function isValidISODate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) && // Checks if date is valid
    dateStr === date.toISOString().split('T')[0] // Verifies string representation matches
  );
}
