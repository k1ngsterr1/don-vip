"use client";

import reactQueryClient from "@/shared/config/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef } from "react";
import { apiClient } from "@/shared/config/apiClient";
import { useAuthStore } from "@/entities/auth/store/auth.store";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const {
    user,
    setUser,
    setTokens,
    isAuthenticated,
    isGuestAuth,
    setGuestAuth,
  } = useAuthStore();
  const guestAuthAttemptedRef = useRef(false);

  useEffect(() => {
    if (guestAuthAttemptedRef.current) {
      return;
    }

    const checkGuestUser = async () => {
      const authStorage = localStorage.getItem("auth-storage");

      if (authStorage) {
        try {
          const parsedStorage = JSON.parse(authStorage);
          const state = parsedStorage.state;

          if (state && state.isGuestAuth && !isGuestAuth) {
            setGuestAuth(true);
          }
          if (user || isGuestAuth || state?.isGuestAuth) {
            guestAuthAttemptedRef.current = true;

            return;
          }
        } catch (e) {
          console.error(
            "👤 [Auth] #43 - ClientLayout: Error parsing auth storage",
            e
          );
        }
      }

      if (isAuthenticated || isGuestAuth || user) {
        guestAuthAttemptedRef.current = true;
        return;
      }
    };

    checkGuestUser();
  }, [isAuthenticated, isGuestAuth, user, setUser, setTokens, setGuestAuth]);

  return (
    <QueryClientProvider client={reactQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ClientLayout;
