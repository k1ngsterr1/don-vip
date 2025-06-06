// Matches any character that is not a digit
const nonDigitRegex = /\D/g;

/**
 * Formats the phone number input string to ensure it starts with '+'
 * and is followed only by digits.
 * - If the input is "123", it becomes "+123".
 * - If the input is "+123a45", it becomes "+12345".
 * - If the input is "abc", it becomes "+".
 * - Allows empty string or just "+" for intermediate input states.
 */
export function formatPhoneNumberInput(currentValue: string): string {
  // Allow empty string or just "+"
  if (currentValue === "" || currentValue === "+") {
    return currentValue;
  }

  const digits = currentValue.replace(nonDigitRegex, ""); // Get all digits from the current value

  // If the original value started with '+', or if it didn't but we have digits,
  // construct the new value as "+" followed by the extracted digits.
  if (currentValue.startsWith("+") || digits.length > 0) {
    return `+${digits}`;
  } else {
    // If it doesn't start with '+' and has no digits (e.g., user typed 'abc'),
    // return "+" to guide them that this is a phone input expecting a country code.
    return "+";
  }
}

/**
 * Validates a phone number string.
 * Basic validation: checks if it starts with '+' and has between 7 and 15 digits.
 * For robust validation, a library like libphonenumber-js is recommended.
 */
export function isValidPhoneNumber(value: string): boolean {
  return /^\+\d{7,15}$/.test(value);
}

/**
 * Normalizes a phone number for API submission.
 * Ensures it's in the format `+<digits>`.
 * This might be redundant if formatPhoneNumberInput is consistently used,
 * but good for explicit sanitization.
 */
export function normalizePhoneNumberForApi(value: string): string {
  const digits = value.replace(nonDigitRegex, "");
  if (digits.length === 0) return ""; // Return empty if no digits
  return `+${digits}`;
}
