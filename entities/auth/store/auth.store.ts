import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";
import { CookieManager, COOKIE_NAMES } from "@/shared/utils/cookies";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuestAuth: boolean;
  guestAuthLoading: boolean; // 👈 добавлено
  error: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setGuestAuth: (isGuest: boolean) => void;
  setGuestAuthLoading: (loading: boolean) => void; // 👈 добавлено
  clearTokens: () => void;
  logout: () => void;
  getAuthHeader: () => { Authorization: string } | {};
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isGuestAuth: false,
      error: null,

      guestAuthLoading: false,

      setGuestAuthLoading: (loading) => {
        set({ guestAuthLoading: loading });
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isGuestAuth: false,
        });

        // Set axios default header for future requests
        apiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Save tokens to cookies for persistence across browser sessions
        // Увеличиваем срок хранения токенов для длительной сессии
        CookieManager.set(COOKIE_NAMES.AUTH_TOKEN, accessToken, {
          expires: 30, // 30 дней (было 7)
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        CookieManager.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
          expires: 90, // 90 дней (было 30)
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        // Также сохраняем в localStorage как backup
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
        }
      },

      setGuestAuth: (isGuest) => {
        set({ isGuestAuth: isGuest });
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, isAuthenticated: false });

        // Clear axios authorization header
        delete apiClient.defaults.headers.common["Authorization"];

        // Clear cookies
        CookieManager.remove(COOKIE_NAMES.AUTH_TOKEN);
        CookieManager.remove(COOKIE_NAMES.REFRESH_TOKEN);

        // Clear localStorage backup
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isGuestAuth: false,
        });

        // Clear axios authorization header
        delete apiClient.defaults.headers.common["Authorization"];

        // Clear auth cookies
        CookieManager.remove(COOKIE_NAMES.AUTH_TOKEN);
        CookieManager.remove(COOKIE_NAMES.REFRESH_TOKEN);

        // Clear userId and tokens from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("userId");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
        }
      },

      getAuthHeader: () => {
        const accessToken = get().accessToken;
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user, // Добавляем user для сохранения
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        isGuestAuth: state.isGuestAuth,
      }),
    }
  )
);

// Setup axios interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          // Try to refresh the token
          const response = await apiClient.post("/auth/refresh", {
            token: refreshToken,
          });
          const { access_token } = response.data;

          // Update the token in the store
          useAuthStore.getState().setTokens(access_token, refreshToken);

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // If refreshing fails, log out the user
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      } else {
        // If no refresh token, log out the user
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// Initialize auth from cookies if not present in store
const initializeAuthFromCookies = () => {
  const state = useAuthStore.getState();

  // If tokens are already in store, use them
  if (state.accessToken) {
    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${state.accessToken}`;
    return;
  }

  // Try to get tokens from cookies first
  let cookieAccessToken = CookieManager.get(COOKIE_NAMES.AUTH_TOKEN);
  let cookieRefreshToken = CookieManager.get(COOKIE_NAMES.REFRESH_TOKEN);

  // If cookies don't have tokens, try localStorage (backup)
  if (
    typeof window !== "undefined" &&
    (!cookieAccessToken || !cookieRefreshToken)
  ) {
    cookieAccessToken = cookieAccessToken || localStorage.getItem("auth_token");
    cookieRefreshToken =
      cookieRefreshToken || localStorage.getItem("refresh_token");
  }

  if (cookieAccessToken && cookieRefreshToken) {
    // Set tokens in store from cookies/localStorage
    state.setTokens(cookieAccessToken, cookieRefreshToken);
  }
};

// Initialize auth header from persisted state or cookies
initializeAuthFromCookies();
