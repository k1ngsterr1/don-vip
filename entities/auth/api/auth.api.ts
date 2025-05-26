import { apiClient } from "@/shared/config/apiClient";
import { getUserId } from "@/shared/hooks/use-get-user-id";
import { useAuthStore } from "../store/auth.store";

// Add a flag to track ongoing guest auth requests
let isGuestAuthInProgress = false;

// Types
export interface LoginDto {
  identifier: string;
  password: string;
}

export interface RegisterDto {
  identifier: string;
  password: string;
  lang?: string;
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
  /**
   * Get current user profile (authenticated user)
   */
  /**
   * Get current user profile (handles both regular and guest users)
   */
  getCurrentUser: async (): Promise<any> => {
    const { isGuestAuth, user } = useAuthStore.getState();

    // If already have user in store, return it
    if (user) {
      return user;
    }

    // If guest, use guest endpoint
    if (isGuestAuth) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const response = await apiClient.get(`/user/guest-me/${userId}`);
        const guestUser = response.data;
        useAuthStore.getState().setUser(guestUser);
        return guestUser;
      }
      // If no userId, fallback to guestAuth
      return await authApi.guestAuth();
    }

    // Try to get regular user
    try {
      const response = await apiClient.get(`/user/me`);
      const regularUser = response.data;
      useAuthStore.getState().setUser(regularUser);
      useAuthStore.getState().setGuestAuth(false);
      return regularUser;
    } catch (error) {
      // If not authenticated, fallback to guest
      return await authApi.guestAuth();
    }
  },

  /**
   * Get guest user profile by ID (no auth)
   */
  getGuestUserById: async (id: number): Promise<any> => {
    const response = await apiClient.get(`/user/guest-me/${id}`);
    return response.data;
  },

  /**
   * Guest authentication
   */
  guestAuth: async (): Promise<any> => {
    // Check if already authenticated as guest
    if (useAuthStore.getState().isGuestAuth) {
      const currentUser = useAuthStore.getState().user;
      if (currentUser?.id) {
        console.log(
          "👤 [Auth] #12 - guestAuth: Already a guest user, returning current user"
        );
        return {
          success: true,
          isGuest: true,
          user: currentUser,
          id: currentUser.id,
        };
      }
    }

    // Check if a guest auth request is already in progress
    if (isGuestAuthInProgress) {
      console.log(
        "👤 [Auth] #12.1 - guestAuth: Guest auth already in progress, waiting..."
      );
      // Wait for the existing request to complete (simple polling)
      let attempts = 0;
      while (isGuestAuthInProgress && attempts < 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      // After waiting, check if we have a user now
      if (useAuthStore.getState().isGuestAuth && useAuthStore.getState().user) {
        console.log(
          "👤 [Auth] #12.2 - guestAuth: Guest auth completed by another request, using that user"
        );
        return {
          success: true,
          isGuest: true,
          user: useAuthStore.getState().user,
          id: useAuthStore.getState().user?.id,
        };
      }
    }

    console.log("👤 [Auth] #13 - guestAuth: Making guest auth API call");

    try {
      // Set the flag to prevent concurrent requests
      isGuestAuthInProgress = true;

      // Double-check if another request completed guest auth while we were setting the flag
      if (useAuthStore.getState().isGuestAuth && useAuthStore.getState().user) {
        console.log(
          "👤 [Auth] #13.1 - guestAuth: Guest auth completed by another request, using that user"
        );
        isGuestAuthInProgress = false;
        return {
          success: true,
          isGuest: true,
          user: useAuthStore.getState().user,
          id: useAuthStore.getState().user?.id,
        };
      }

      const res = await apiClient.post("/auth/guest");
      const guestUser = res.data;

      if (guestUser?.id) {
        localStorage.setItem("userId", guestUser.id.toString());
        useAuthStore.getState().setUser(guestUser);
        useAuthStore.getState().setGuestAuth(true);
        console.log(
          "👤 [Auth] #14 - guestAuth: Guest auth successful, setting isGuestAuth to true"
        );

        // If tokens are included in the response, set them
        if (guestUser.access_token && guestUser.refresh_token) {
          useAuthStore
            .getState()
            .setTokens(guestUser.access_token, guestUser.refresh_token);
          console.log("👤 [Auth] #15 - guestAuth: Setting guest tokens");
        }

        isGuestAuthInProgress = false;
        return guestUser;
      }

      console.error("👤 [Auth] #16 - guestAuth: Invalid guest user response");
      isGuestAuthInProgress = false;
      throw new Error("Invalid guest user response");
    } catch (error) {
      console.error(
        "👤 [Auth] #16.1 - guestAuth: Error during guest auth",
        error
      );
      isGuestAuthInProgress = false;
      throw error;
    }
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
