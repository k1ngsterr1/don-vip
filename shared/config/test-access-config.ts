// shared/config/test-access-config.ts
export const TEST_ACCESS_CONFIG = {
  isEnabled: process.env.NEXT_PUBLIC_TEST_MODE === "true",
  credentials: {
    login:
      process.env.NEXT_PUBLIC_TEST_MODE_LOGIN ||
      "Dev_Admin_2024_Secure_Access_K7n9Bx4Wq2",
    password:
      process.env.NEXT_PUBLIC_TEST_MODE_PASSWORD ||
      "Ultra$ecure_Dev_Pa$$w0rd_2024!@#$%AdminAccess_Zx8Qm3Rp7K5vN9cB",
  },
};

// Функция для получения учетных данных с проверками
export function getTestAccessCredentials() {
  const login = process.env.NEXT_PUBLIC_TEST_MODE_LOGIN;
  const password = process.env.NEXT_PUBLIC_TEST_MODE_PASSWORD;

  // Если переменные окружения не найдены, используем fallback только в development
  if (!login || !password) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Environment variables not found, using fallback credentials"
      );
      return {
        login: "Dev_Admin_2024_Secure_Access_K7n9Bx4Wq2",
        password:
          "Ultra$ecure_Dev_Pa$$w0rd_2024!@#$%AdminAccess_Zx8Qm3Rp7K5vN9cB",
      };
    }
    return { login: "", password: "" };
  }

  return { login, password };
}
