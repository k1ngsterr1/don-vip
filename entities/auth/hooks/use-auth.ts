"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";
import {
  authApi,
  type ChangePasswordDto,
  type RegisterDto,
} from "../api/auth.api";
import { queryKeys } from "@/shared/config/queryKeys";
import type { User } from "../types/auth.types";

/**
 * Hook for login functionality
 */
export const useLogin = () => {
  const { setTokens, setUser, setGuestAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) => {
      return authApi.login({
        identifier: credentials.identifier,
        password: credentials.password,
      });
    },
    onSuccess: async (data) => {
      // Set tokens in auth store
      setTokens(data.access_token, data.refresh_token);

      // Explicitly set isGuestAuth to false when logging in
      setGuestAuth(false);

      // Fetch user data
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {}

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    },
  });
};

export const useGetMe = () => {
  return useQuery<User>({
    queryKey: queryKeys.auth.user,
    queryFn: () => authApi.getCurrentUser(),
  });
};

/**
 * Hook for guest authentication
 */
export const useGuestAuth = () => {
  const { setUser, setGuestAuth, isGuestAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      // Skip if already authenticated as guest
      if (isGuestAuth) {
        return Promise.resolve({ success: true, isGuest: true });
      }
      return authApi.guestAuth();
    },
    onSuccess: async (data) => {
      if (!isGuestAuth) {
        setUser(data);
        setGuestAuth(true);

        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
      }
    },
  });
};

/**
 * Hook for registration functionality
 */
export const useRegister = () => {
  const router = useRouter();
  const { setTokens, setUser, setGuestAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterDto) => authApi.register(userData),
    onSuccess: async (data) => {
      // Set tokens
      setTokens(data.access_token, data.refresh_token);

      // Explicitly set isGuestAuth to false when registering
      setGuestAuth(false);

      // Fetch and set user
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {}

      // Invalidate user query
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });

      // Redirect to success page
      router.push("/auth/verify");
    },
  });
};

/**
 * Hook for changing password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { email?: string; phone?: string; lang?: string }) => {
      const identifier = data.email || data.phone;
      const payload: ChangePasswordDto = {
        identifier,
        lang: data.lang,
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
