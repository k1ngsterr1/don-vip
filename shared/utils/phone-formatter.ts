/**
 * Phone number formatting utilities
 */

/**
 * Formats a phone number with Russian formatting: +7 (XXX) XXX-XX-XX
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, "");

  // If it starts with +7, format as Russian number
  if (cleaned.startsWith("+7") || cleaned.startsWith("7")) {
    const digits = cleaned.replace(/^\+?7/, "");
    if (digits.length >= 10) {
      const formatted = digits.slice(0, 10);
      return `+7 (${formatted.slice(0, 3)}) ${formatted.slice(
        3,
        6
      )}-${formatted.slice(6, 8)}-${formatted.slice(8, 10)}`;
    } else if (digits.length > 0) {
      // Partial formatting for incomplete numbers
      if (digits.length <= 3) {
        return `+7 (${digits}`;
      } else if (digits.length <= 6) {
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
      } else if (digits.length <= 8) {
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
          6
        )}`;
      } else {
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
          6,
          8
        )}-${digits.slice(8)}`;
      }
    } else {
      return "+7 (";
    }
  }

  // For other formats, return as is or apply basic formatting
  return value;
}

/**
 * Gets formatted phone number for API submission (keeps formatting)
 */
export function getFormattedPhoneNumber(phone: string): string {
  // Return the properly formatted version
  return formatPhoneNumber(phone);
}

/**
 * Validates if a phone number is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = getFormattedPhoneNumber(phone);
  // Russian phone numbers should have 12 characters (+7 + 10 digits)
  const cleanedNumber = cleaned.replace(/[^\d+]/g, "");
  return cleanedNumber.length === 12 && cleanedNumber.startsWith("+7");
}

/**
 * Formats phone number for display (ensures consistent formatting)
 */
export function displayPhoneNumber(phone: string): string {
  if (!phone) return "";

  // If already formatted, return as is
  if (phone.includes("(") && phone.includes(")")) {
    return phone;
  }

  // Otherwise format it
  return formatPhoneNumber(phone);
}
