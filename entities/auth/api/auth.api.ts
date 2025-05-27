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
  identifier: any;
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
    const storedUserId = localStorage.getItem("userId");

    // ✅ 0. Если userId есть — выходим РАНО, никакой авторизации не делаем
    if (storedUserId) {
      console.log(
        "👤 [Auth] Skipping guest auth — userId already in localStorage"
      );

      // Можем опционально восстановить пользователя из стора, если доступен
      return {
        success: true,
        isGuest: true,
        user: useAuthStore.getState().user,
        id: storedUserId,
      };
    }

    // ✅ Получаем zustand состояние
    const {
      isGuestAuth,
      user,
      guestAuthLoading,
      setGuestAuthLoading,
      setUser,
      setGuestAuth,
      setTokens,
    } = useAuthStore.getState();

    // ✅ Если уже авторизован — тоже выходим
    if (isGuestAuth && user?.id) {
      console.log(
        "👤 [Auth] Already authenticated as guest, skipping API call"
      );
      return {
        success: true,
        isGuest: true,
        user,
        id: user.id,
      };
    }

    // ✅ Если авторизация в процессе — ждём
    if (guestAuthLoading) {
      console.log("👤 [Auth] Guest auth in progress... waiting");
      let attempts = 0;
      while (useAuthStore.getState().guestAuthLoading && attempts < 10) {
        await new Promise((res) => setTimeout(res, 100));
        attempts++;
      }

      const u = useAuthStore.getState().user;
      const id = u?.id ?? localStorage.getItem("userId");

      if (useAuthStore.getState().isGuestAuth && id) {
        console.log("👤 [Auth] Guest auth completed by another process");
        return {
          success: true,
          isGuest: true,
          user: u,
          id,
        };
      }
    }

    // ✅ Всё, запускаем guest auth только если дошли до сюда
    console.log("👤 [Auth] Making guest auth API call");
    try {
      setGuestAuthLoading(true);

      const res = await apiClient.post("/auth/guest");
      const guestUser = res.data;

      if (guestUser?.id) {
        localStorage.setItem("userId", guestUser.id.toString());
        setUser(guestUser);
        setGuestAuth(true);

        if (guestUser.access_token && guestUser.refresh_token) {
          setTokens(guestUser.access_token, guestUser.refresh_token);
          console.log("👤 [Auth] Guest tokens set");
        }

        console.log("👤 [Auth] Guest auth successful");
        return {
          success: true,
          isGuest: true,
          user: guestUser,
          id: guestUser.id,
        };
      } else {
        throw new Error("Invalid guest user response");
      }
    } catch (err) {
      console.error("👤 [Auth] Guest auth failed", err);
      throw err;
    } finally {
      setGuestAuthLoading(false);
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
