import { apiClient } from "@/shared/config/apiClient";

// Types
export interface LoginDto {
  email?: string;
  phone?: string;
  password: string;
}

export interface RegisterDto {
  identifier: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword?: string;
  newPassword: string;
  email?: string;
  phone?: string;
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
   * Login with credentials
   */
  login: async (credentials: LoginDto): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterDto): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>(
      "/auth/register",
      userData
    );
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
