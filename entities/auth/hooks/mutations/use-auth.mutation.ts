"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/auth.store";

export const useLogin = () => {
  const { setTokens } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Set tokens in auth store
      setTokens(data.access_token, data.refresh_token);

      // Fetch user data and invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["user"] });

      // Redirect to profile or dashboard
      router.push("/profile/1");
    },
  });
};

export const useRegister = () => {
  const { setTokens } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setTokens(data.access_token, data.refresh_token);
      router.push("/profile/1");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authApi.changePassword,
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear(); // Clear all query cache
    router.push("/auth/login");
  };
};

export const useRefreshToken = () => {
  const { refreshToken, setTokens } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      if (!refreshToken) throw new Error("No refresh token available");
      return authApi.refreshToken(refreshToken);
    },
    onSuccess: (data) => {
      if (refreshToken) {
        setTokens(data.access_token, refreshToken);
      }
    },
  });
};
