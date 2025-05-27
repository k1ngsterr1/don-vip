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
            console.log(
              "👤 [Auth] #34 - GuestAuthProvider: Found isGuestAuth in storage, updating state"
            );
            setGuestAuth(true);
            guestAuthAttemptedRef.current = true;
          }

          // Clean up old userId if we have auth storage
          if (userId) {
            console.log(
              "👤 [Auth] #35 - GuestAuthProvider: Removing old userId from localStorage"
            );
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
      guestAuthAttemptedRef.current = true;

      // If we have a userId but no auth storage or isGuestAuth is false, we might need to recreate the guest session
      if (!userId || !isGuestAuth) {
        try {
          console.log("👤 [Auth] #37 - GuestAuthProvider: Creating guest user");
          const response = await apiClient.post("/auth/guest");
          const {
            user: guestUser,
            access_token,
            refresh_token,
          } = response.data;

          if (guestUser?.id) {
            setUser(guestUser);
            setGuestAuth(true);
            console.log(
              "👤 [Auth] #38 - GuestAuthProvider: Guest user created, setting isGuestAuth to true"
            );

            // Set tokens if available
            if (access_token && refresh_token) {
              setTokens(access_token, refresh_token);
              console.log(
                "👤 [Auth] #39 - GuestAuthProvider: Setting guest tokens"
              );
            }

            localStorage.setItem("userId", guestUser.id);
          }
        } catch (error) {
          console.error(
            "👤 [Auth] #40 - GuestAuthProvider: Failed to create guest user",
            error
          );
        }
      }
    };

    checkGuestUser();
  }, [isAuthenticated, isGuestAuth, user, setUser, setTokens, setGuestAuth]);

  return <>{children}</>;
}
