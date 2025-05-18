"use client";

import reactQueryClient from "@/shared/config/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";
import { apiClient } from "@/shared/config/apiClient";
import { useAuthStore } from "@/entities/auth/store/auth.store";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { user, setUser, setTokens, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkGuestUser = async () => {
      const authStorage = localStorage.getItem("auth-storage");

      // ✅ Если auth-storage уже есть — удалим устаревший userId
      if (authStorage && localStorage.getItem("userId")) {
        localStorage.removeItem("userId");
      }

      if (isAuthenticated || user) {
        return;
      }

      if (!authStorage) {
        try {
          const response = await apiClient.post("/auth/guest");
          localStorage.setItem("userId", response.data.id);
        } catch (error) {}
      }
    };

    checkGuestUser();
  }, [isAuthenticated, user, setUser, setTokens]);

  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientLayout;
