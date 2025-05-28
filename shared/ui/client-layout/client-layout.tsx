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

      // If auth-storage exists, check if it contains isGuestAuth
      if (authStorage) {
        try {
          const parsedStorage = JSON.parse(authStorage);
          const state = parsedStorage.state;

          // If isGuestAuth is true in storage but not in state, update it
          if (state && state.isGuestAuth && !isGuestAuth) {
            console.log(
              "👤 [Auth] #41 - ClientLayout: Found isGuestAuth in storage, updating state"
            );
            setGuestAuth(true);
          }
          if (user || isGuestAuth || state?.isGuestAuth) {
            guestAuthAttemptedRef.current = true;
            console.log(
              "👤 [Auth] #42.1 - ClientLayout: User or guest auth already set, skipping"
            );
            return;
          }
        } catch (e) {
          console.error(
            "👤 [Auth] #43 - ClientLayout: Error parsing auth storage",
            e
          );
          // If parsing fails, continue
        }
      }

      // Skip if already authenticated or is a guest user
      if (isAuthenticated || isGuestAuth || user) {
        console.log(
          "👤 [Auth] #44 - ClientLayout: Already authenticated or guest, skipping"
        );
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
