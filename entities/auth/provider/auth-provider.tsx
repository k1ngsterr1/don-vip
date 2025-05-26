"use client";

import type React from "react";

import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (accessToken) {
      const initializeAuth = async () => {
        try {
          await queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: async () => {
              const { apiClient } = await import("@/shared/config/apiClient");
              const response = await apiClient.get("/user/me");
              return response.data;
            },
          });
        } catch (error) {
        }
      };

      initializeAuth();
    }
  }, [accessToken]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
