// This file contains the error translation functions that you already have in your forms

// Convert technical errors to human-readable messages for login
export function getLoginHumanReadableError(error: string): string {
  if (error.includes("status code 400")) {
    return "Invalid email or password";
  }
  if (error.includes("status code 401")) {
    return "Invalid credentials";
  }
  if (error.includes("status code 403")) {
    return "Account is locked";
  }
  if (error.includes("status code 404")) {
    return "Account not found";
  }
  if (error.includes("status code 429")) {
    return "Too many login attempts, please try again later";
  }
  if (error.includes("status code")) {
    return "Login failed. Please try again later";
  }
  return error;
}

// Convert technical errors to human-readable messages for registration
export function getRegisterHumanReadableError(error: string): string {
  if (error.includes("status code 400")) {
    return "Invalid information provided";
  }
  if (error.includes("status code 409")) {
    return "This email or phone is already registered";
  }
  if (error.includes("status code 422")) {
    return "Please check your information";
  }
  if (error.includes("status code 429")) {
    return "Too many registration attempts, please try again later";
  }
  if (error.includes("status code")) {
    return "Registration failed. Please try again later";
  }
  return error;
}

// Helper function to get error messages in both languages
export function getErrorMessages(code: number, message: string) {
  // Default error messages
  const defaultError = {
    en: "Operation failed. Please try again.",
    ru: "Операция не удалась. Пожалуйста, попробуйте снова.",
  };

  // Error messages by HTTP status code
  const errorMessages: Record<number, { en: string; ru: string }> = {
    400: {
      en: "Invalid request. Please check your input.",
      ru: "Неверный запрос. Пожалуйста, проверьте ваши данные.",
    },
    401: {
      en: "Invalid email or password.",
      ru: "Неверный email или пароль.",
    },
    403: {
      en: "Access denied. You don't have permission.",
      ru: "Доступ запрещен. У вас нет разрешения.",
    },
    404: {
      en: "User not found.",
      ru: "Пользователь не найден.",
    },
    409: {
      en: "This email or phone is already registered.",
      ru: "Этот email или телефон уже зарегистрирован.",
    },
    422: {
      en: "Validation error. Please check your input.",
      ru: "Ошибка валидации. Пожалуйста, проверьте ваши данные.",
    },
    429: {
      en: "Too many attempts. Please try again later.",
      ru: "Слишком много попыток. Пожалуйста, попробуйте позже.",
    },
    500: {
      en: "Server error. Please try again later.",
      ru: "Ошибка сервера. Пожалуйста, попробуйте позже.",
    },
  };

  // If we have a specific message from the server, use it
  if (message) {
    return {
      en: message,
      ru: translateErrorMessage(message), // Translate the message
    };
  }

  // Return the error message for the status code or default
  return errorMessages[code] || defaultError;
}

// Helper function to translate common error messages
export function translateErrorMessage(message: string): string {
  const translations: Record<string, string> = {
    "Invalid credentials": "Неверные учетные данные",
    "User not found": "Пользователь не найден",
    "Invalid email format": "Неверный формат email",
    "Invalid phone number": "Неверный номер телефона",
    "Password is required": "Требуется пароль",
    "Email is required": "Требуется email",
    "Phone number is required": "Требуется номер телефона",
    "Account is locked": "Аккаунт заблокирован",
    "Too many login attempts": "Слишком много попыток входа",
    "Email already in use": "Email уже используется",
    "Phone number already in use": "Номер телефона уже используется",

    "Password is too weak": "Пароль слишком слабый",
    "Registration is temporarily disabled": "Регистрация временно отключена",
    "Too many registration attempts": "Слишком много попыток регистрации",
    "Invalid information provided": "Предоставлена неверная информация",
    "This email or phone is already registered":
      "Этот email или телефон уже зарегистрирован",
    "Please check your information": "Пожалуйста, проверьте вашу информацию",
    "Registration failed. Please check your information.":
      "Ошибка регистрации. Пожалуйста, проверьте вашу информацию.",
    "Invalid email or password": "Неверный email или пароль",
    "Login failed. Please try again later":
      "Ошибка входа. Пожалуйста, попробуйте снова.",
  };

  return translations[message] || message;
}
