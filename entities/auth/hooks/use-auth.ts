"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";
import { authApi, ChangePasswordDto, RegisterDto } from "../api/auth.api";
import { queryKeys } from "@/shared/config/queryKeys";

/**
 * Hook for login functionality
 */
export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) => {
      return authApi.login({
        email: credentials.identifier.includes("@")
          ? credentials.identifier
          : undefined,
        phone: !credentials.identifier.includes("@")
          ? credentials.identifier
          : undefined,
        password: credentials.password,
      });
    },
    onSuccess: async (data) => {
      // Set tokens in auth store
      setTokens(data.access_token, data.refresh_token);

      // Fetch user data
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data after login", error);
      }

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

/**
 * Hook for registration functionality
 */
export const useRegister = () => {
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterDto) => authApi.register(userData),
    onSuccess: async (data) => {
      // Set tokens in auth store
      setTokens(data.access_token, data.refresh_token);

      // Fetch user data
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data after registration", error);
      }

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: {
      email?: string;
      oldPassword?: string;
      newPassword?: string;
    }) => {
      const payload: ChangePasswordDto = {
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword || "",
      };
      return authApi.changePassword(payload);
    },
  });
};

/**
 * Hook for logout functionality
 */
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
