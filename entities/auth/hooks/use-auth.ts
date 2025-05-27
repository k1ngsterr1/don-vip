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
      console.log(
        "👤 [Auth] #17 - useLogin: Login successful, setting isGuestAuth to false"
      );

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
        console.log(
          "👤 [Auth] #18 - useGuestAuth: Already a guest user, skipping API call"
        );
        return Promise.resolve({ success: true, isGuest: true });
      }
      console.log("👤 [Auth] #19 - useGuestAuth: Making guest auth API call");
      return authApi.guestAuth();
    },
    onSuccess: async (data) => {
      if (!isGuestAuth) {
        setUser(data);
        setGuestAuth(true);
        console.log(
          "👤 [Auth] #20 - useGuestAuth: Guest auth successful, setting isGuestAuth to true"
        );
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
      console.log(
        "👤 [Auth] #21 - useRegister: Registration successful, setting isGuestAuth to false"
      );

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
      const payload: ChangePasswordDto = {
        identifier: data.phone || data.email,
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
    console.log(
      "👤 [Auth] #22 - useLogout: Logging out, resetting isGuestAuth"
    );
    logout();
    queryClient.clear(); // Clear all query cache
    router.push("/auth/login");
  };
};
