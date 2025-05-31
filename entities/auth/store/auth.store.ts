import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";

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
      },

      setGuestAuth: (isGuest) => {
        set({ isGuestAuth: isGuest });
      },

      clearTokens: () => {
        set({ accessToken: null, refreshToken: null, isAuthenticated: false });

        // Clear axios authorization header
        delete apiClient.defaults.headers.common["Authorization"];
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

        // Clear userId from localStorage
        localStorage.removeItem("userId");
      },

      getAuthHeader: () => {
        const accessToken = get().accessToken;
        return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
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

// Initialize auth header from persisted state
const accessToken = useAuthStore.getState().accessToken;
if (accessToken) {
  apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}
