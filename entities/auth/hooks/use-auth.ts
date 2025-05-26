"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";
import { authApi, ChangePasswordDto, RegisterDto } from "../api/auth.api";
import { queryKeys } from "@/shared/config/queryKeys";
import { User } from "../types/auth.types";

/**
 * Hook for login functionality
 */
export const useLogin = () => {
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) => {
      return authApi.login({
        identifier: credentials.identifier, // Send the identifier as is, whether email or phone
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
 * Hook for registration functionality
 */

export const useRegister = () => {
  const router = useRouter(); // <-- Router hook
  const { setTokens, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterDto) => authApi.register(userData),
    onSuccess: async (data) => {
      // Set tokens
      setTokens(data.access_token, data.refresh_token);

      // Fetch and set user
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {}

      // Invalidate user query
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });

      // ✅ Redirect to success page
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
        email: data.email,
        phone: data.phone,
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
