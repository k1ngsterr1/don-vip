"use client";

import type React from "react";
import { useEffect } from "react";
import { apiClient } from "@/shared/config/apiClient";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setTokens, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkGuestUser = async () => {
      if (isAuthenticated) {
        return;
      }

      const localStorageUser = localStorage.getItem("auth-storage");
      const userId = localStorage.getItem("userId");

      if (!userId) {
        try {
          const response = await apiClient.post("/api/auth/guest");

          const { user: guestUser, accessToken, refreshToken } = response.data;

          localStorage.setItem("userId", guestUser.id);
        } catch (error) {}
      } else {
      }
    };

    checkGuestUser();
  }, [isAuthenticated, user, setUser, setTokens]);

  return <>{children}</>;
}
