import { apiClient } from "@/shared/config/apiClient";
import { getUserId } from "@/shared/hooks/use-get-user-id";

// Types
export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterDto {
  identifier: string;
  password: string;
  lang?: string; // ✅ Optional or required, depending on your needs
}

export interface ChangePasswordDto {
  email?: string;
  phone?: string;
  lang: any;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Auth API client for authentication-related operations
 */
export const authApi = {
  /**
   * Login with credentials + userId in body
   */
  login: async (credentials: LoginDto): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>("/auth/login", {
      ...credentials,
    });
    return response.data;
  },

  /**
   * Register a new user + userId in body
   */
  register: async (userData: RegisterDto): Promise<TokenResponse> => {
    const userId = await getUserId();

    const response = await apiClient.post<TokenResponse>("/auth/register", {
      ...userData,
      id: userId,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<any> => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/change-password",
      data
    );
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (token: string): Promise<{ access_token: string }> => {
    const response = await apiClient.post<{ access_token: string }>(
      "/auth/refresh",
      {
        token,
      }
    );
    return response.data;
  },
};
