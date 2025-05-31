"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { apiClient } from "@/shared/config/apiClient";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
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
    // Only run this once per component lifecycle
    if (guestAuthAttemptedRef.current) {
      return;
    }

    const checkGuestUser = async () => {
      // Skip if already authenticated or is a guest user
      if (isAuthenticated || isGuestAuth) {
        console.log(
          "👤 [Auth] #33 - GuestAuthProvider: Already authenticated or guest, skipping"
        );
        guestAuthAttemptedRef.current = true;
        return;
      }

      const authStorage = localStorage.getItem("auth-storage");
      const userId = localStorage.getItem("userId");

      // If we have auth storage, check if it contains isGuestAuth
      if (authStorage) {
        try {
          const parsedStorage = JSON.parse(authStorage);
          const state = parsedStorage.state;

          // If isGuestAuth is true in storage but not in state, update it
          if (state && state.isGuestAuth && !isGuestAuth) {
            setGuestAuth(true);
            guestAuthAttemptedRef.current = true;
          }

          // Clean up old userId if we have auth storage
          if (userId) {
            localStorage.removeItem("userId");
          }

          // If we have a user in state or we've set isGuestAuth, we're done
          if (user || isGuestAuth || state?.isGuestAuth) {
            guestAuthAttemptedRef.current = true;
            return;
          }
        } catch (e) {
          console.error(
            "👤 [Auth] #36 - GuestAuthProvider: Error parsing auth storage",
            e
          );
          // If parsing fails, continue with guest auth
        }
      }

      // Mark that we've attempted guest auth
    };

    checkGuestUser();
  }, [isAuthenticated, isGuestAuth, user, setUser, setTokens, setGuestAuth]);

  return <>{children}</>;
}
