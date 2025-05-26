"use client";

interface VerificationErrorProps {
  error: string | null;
  locale?: string;
}

// Error translations for verification errors
const errorTranslations: Record<string, Record<string, string>> = {
  en: {
    // HTTP status code errors
    "status code 400": "Invalid verification code. Please try again.",
    "status code 401": "Unauthorized. Please try again or request a new code.",
    "status code 403": "Access forbidden. Please contact support.",
    "status code 404":
      "Account not found. Please check your email or phone number.",
    "status code 429": "Too many attempts. Please try again later.",
    "status code 500": "Server error. Please try again later.",

    // Common verification errors
    "Invalid code": "Invalid verification code. Please try again.",
    "Code expired": "Verification code has expired. Please request a new one.",
    "Too many attempts": "Too many attempts. Please try again later.",
    "Invalid verification code": "Invalid verification code. Please try again.",
    "Verification code expired":
      "Verification code has expired. Please request a new one.",
    "User not found":
      "Account not found. Please check your email or phone number.",
    "Request failed": "Request failed. Please try again.",

    // Generic fallback
    "An error occurred": "An error occurred. Please try again.",
  },
  ru: {
    // HTTP status code errors
    "status code 400":
      "Неверный код подтверждения. Пожалуйста, попробуйте снова.",
    "status code 401":
      "Не авторизован. Пожалуйста, попробуйте снова или запросите новый код.",
    "status code 403": "Доступ запрещен. Пожалуйста, обратитесь в поддержку.",
    "status code 404":
      "Аккаунт не найден. Пожалуйста, проверьте ваш email или номер телефона.",
    "status code 429": "Слишком много попыток. Пожалуйста, попробуйте позже.",
    "status code 500": "Ошибка сервера. Пожалуйста, попробуйте позже.",

    // Common verification errors
    "Invalid code": "Неверный код подтверждения. Пожалуйста, попробуйте снова.",
    "Code expired":
      "Срок действия кода истек. Пожалуйста, запросите новый код.",
    "Too many attempts": "Слишком много попыток. Пожалуйста, попробуйте позже.",
    "Invalid verification code":
      "Неверный код подтверждения. Пожалуйста, попробуйте снова.",
    "Verification code expired":
      "Срок действия кода истек. Пожалуйста, запросите новый код.",
    "User not found":
      "Аккаунт не найден. Пожалуйста, проверьте ваш email или номер телефона.",
    "Request failed": "Запрос не выполнен. Пожалуйста, попробуйте снова.",

    // Generic fallback
    "An error occurred": "Произошла ошибка. Пожалуйста, попробуйте снова.",
  },
};

// Translate error message based on current locale
function translateError(message: string, locale: string): string {
  const translations = errorTranslations[locale === "ru" ? "ru" : "en"];

  // Check for direct translation
  if (translations[message]) {
    return translations[message];
  }

  // Check for partial matches (e.g., if the error contains "status code 400")
  for (const key of Object.keys(translations)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return translations[key];
    }
  }

  // Return generic error message if no translation found
  return translations["An error occurred"] || message;
}

export function VerificationError({
  error,
  locale = "en",
}: VerificationErrorProps) {
  if (!error) return null;

  const translatedError = translateError(error, locale);

  return (
    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-md text-sm">
      {translatedError}
    </div>
  );
}
