// Human-readable error messages for HTTP status codes
export const httpErrorMessages: Record<number, string> = {
  400: "Invalid email or password",
  401: "Invalid credentials",
  403: "Account is locked",
  404: "Account not found",
  409: "This email or phone is already registered",
  422: "Please check your information",
  429: "Too many login attempts, please try again later",
  500: "Login failed. Please try again later",
};

// Map error message from HTTP status code
export function getHumanReadableError(error: string): string {
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

// Map registration error message from HTTP status code
export function getRegisterErrorMessage(error: string): string {
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

// Extract error from API response
export function extractApiError(error: any): string {
  // Check if we have a message in the response data
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check if we have a status code to map
  if (error?.response?.status) {
    return httpErrorMessages[error.response.status] || "An error occurred";
  }

  // If we have an error message string
  if (error?.message) {
    return getHumanReadableError(error.message);
  }

  // Default error message
  return "An error occurred. Please try again.";
}
