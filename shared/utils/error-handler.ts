// Map API error codes to translation keys
export function mapErrorToTranslationKey(error: any): string {
  // Extract status code and message from error
  const statusCode = error?.response?.status;
  const errorMessage = error?.response?.data?.message || error?.message || "";

  // Check for specific error messages first
  if (
    errorMessage.includes("already exists") ||
    errorMessage.includes("already in use")
  ) {
    if (errorMessage.includes("email")) {
      return "auth.errors.registration.emailExists";
    }
    if (errorMessage.includes("phone")) {
      return "auth.errors.registration.phoneExists";
    }
    return "auth.errors.registration.userExists";
  }

  if (
    errorMessage.includes("invalid credentials") ||
    errorMessage.includes("invalid password") ||
    errorMessage.includes("invalid email")
  ) {
    return "auth.errors.auth.invalidCredentials";
  }

  if (errorMessage.includes("locked") || errorMessage.includes("blocked")) {
    return "auth.errors.auth.accountLocked";
  }

  if (errorMessage.includes("not found")) {
    return "auth.errors.auth.userNotFound";
  }

  if (
    errorMessage.includes("too many") ||
    errorMessage.includes("rate limit")
  ) {
    return "auth.errors.auth.tooManyAttempts";
  }

  // Fall back to HTTP status code based errors
  if (statusCode) {
    return `auth.errors.http.${statusCode}`;
  }

  // Default general error
  return "auth.errors.server.general";
}

// Helper function to get translated error message
export function getTranslatedError(error: any, t: any): string {
  const key = mapErrorToTranslationKey(error);
  return t(key) || t("auth.errors.server.general");
}
