"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

// Fetch user data from the backend
const fetchCurrentUser = async () => {
  const response = await apiClient.get("/user/me");
  return response.data;
};

// Auth hook for accessing current user and auth state
export function useAuth(
  options: { requireAuth?: boolean; redirectTo?: string } = {}
) {
  const { requireAuth = false, redirectTo = "/auth/login" } = options;
  const { isAuthenticated, user, setUser } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Query to fetch user data when needed
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    // Only fetch if authenticated, and enable refetch on window focus for security
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
    // If user data fetch fails due to auth issues, handle it
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
  });

  // Update user data in store when query completes
  useEffect(() => {
    if (userData && !error) {
      setUser(userData);
    }
  }, [userData, error, setUser]);

  // Handle authentication redirect
  useEffect(() => {
    if (requireAuth && !isLoading) {
      if (!isAuthenticated) {
        // Save the current path for redirect after login
        if (pathname !== redirectTo) {
          const returnPath = encodeURIComponent(pathname);
          router.push(`${redirectTo}?returnUrl=${returnPath}`);
        }
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, router, redirectTo, pathname]);

  const queryClient = useQueryClient();

  const logout = () => {
    // Call the logout method from the auth store
    useAuthStore.getState().logout();

    // Clear all query cache to remove any user-specific data
    queryClient.clear();

    // Redirect to login page
    router.push("/auth/login");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout, // Add the logout function here
  };
}
