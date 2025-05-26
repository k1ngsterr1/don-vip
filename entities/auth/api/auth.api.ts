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
  getCurrentUser: async (): Promise<any> => {
    try {
      const userId = await getUserId();
      const response = await apiClient.get(`/user/me`, {
        params: { id: userId },
      });
      const user = response.data;
      useAuthStore.getState().setUser(user);
      // Regular user, not a guest
      useAuthStore.getState().setGuestAuth(false);
      console.log(
        "👤 [Auth] #5 - getCurrentUser: Regular user, setting isGuestAuth to false"
      );
      return user;
    } catch (error: any) {
      // Check if already authenticated as guest
      if (useAuthStore.getState().isGuestAuth) {
        // Return the existing guest user without making another request
        const existingUser = useAuthStore.getState().user;
        if (existingUser) {
          console.log(
            "👤 [Auth] #6 - getCurrentUser: Already a guest user, returning existing user"
          );
          return existingUser;
        }
      }

      // Check if a guest auth request is already in progress
      if (isGuestAuthInProgress) {
        console.log(
          "👤 [Auth] #6.1 - getCurrentUser: Guest auth already in progress, waiting..."
        );
        // Wait for the existing request to complete (simple polling)
        let attempts = 0;
        while (isGuestAuthInProgress && attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }

        // After waiting, check if we have a user now
        if (
          useAuthStore.getState().isGuestAuth &&
          useAuthStore.getState().user
        ) {
          console.log(
            "👤 [Auth] #6.2 - getCurrentUser: Guest auth completed by another request, using that user"
          );
          return useAuthStore.getState().user;
        }
      }

      console.log(
        "👤 [Auth] #7 - getCurrentUser: Failed to get user, trying guest auth"
      );

      try {
        isGuestAuthInProgress = true;

        if (
          useAuthStore.getState().isGuestAuth &&
          useAuthStore.getState().user
        ) {
          console.log(
            "👤 [Auth] #7.1 - getCurrentUser: Guest auth completed by another request, using that user"
          );
          isGuestAuthInProgress = false;
          return useAuthStore.getState().user;
        }

        const res = await apiClient.post("/auth/guest");
        const guestUser = res.data;

        console.log(
          "👤 [Auth] #8 - getCurrentUser: Guest auth successful",
          guestUser
        );

        if (guestUser?.id) {
          localStorage.setItem("userId", guestUser.id.toString());
          useAuthStore.getState().setUser(guestUser);
          useAuthStore.getState().setGuestAuth(true);
          console.log(
            "👤 [Auth] #9 - getCurrentUser: Setting guest user and isGuestAuth to true"
          );
          isGuestAuthInProgress = false;
          return guestUser;
        } else {
          console.error(
            "👤 [Auth] #10 - getCurrentUser: Invalid guest user response"
          );
          isGuestAuthInProgress = false;
          throw new Error("Invalid guest user response");
        }
      } catch (guestError) {
        console.error(
          "👤 [Auth] #11 - getCurrentUser: Guest auth failed:",
          guestError
        );
        isGuestAuthInProgress = false;
        throw guestError;
      }
    }
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
