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
    }
  }

  return value;
}

/**
 * Gets clean phone number for API submission (removes formatting)
 */
export function getCleanPhoneNumber(formattedPhone: string): string {
  // Remove all formatting, keep only digits and +
  const cleaned = formattedPhone.replace(/[^\d+]/g, "");

  // Ensure it starts with +7 for Russian numbers
  if (cleaned.startsWith("7") && !cleaned.startsWith("+7")) {
    return "+" + cleaned;
  }

  return cleaned;
}

/**
 * Validates if a phone number is valid
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = getCleanPhoneNumber(phone);
  // Russian phone numbers should have 12 characters (+7 + 10 digits)
  return cleaned.length === 12 && cleaned.startsWith("+7");
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
