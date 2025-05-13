"use client";

import type React from "react";
import { useEffect } from "react";
import { apiClient } from "@/shared/config/apiClient";
import { useAuthStore } from "@/entities/auth/store/auth.store";

export function GuestAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, setUser, setTokens, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const checkGuestUser = async () => {
      console.log("🟡 [GuestAuth] Проверка состояния авторизации...");

      if (isAuthenticated || user) {
        console.log("✅ [GuestAuth] Пользователь уже авторизован:", user);
        return;
      }

      const localStorageUser = localStorage.getItem("auth-storage");
      const userId = localStorage.getItem("userId");

      console.log("🗃️ [GuestAuth] Содержимое localStorage:");
      console.log("auth-storage:", localStorageUser);
      console.log("userId:", userId);

      if (!userId) {
        console.log("🆕 [GuestAuth] Гость не найден, создаём нового...");

        try {
          const response = await apiClient.post("/api/auth/guest");

          console.log("📥 [GuestAuth] Ответ от API:", response.data);

          const { user: guestUser, accessToken, refreshToken } = response.data;

          localStorage.setItem("userId", guestUser.id);
          console.log(
            "💾 [GuestAuth] Сохранили userId в localStorage:",
            guestUser.id
          );

          console.log("✅ [GuestAuth] Установлены пользователь и токены.");
        } catch (error) {
          console.error("❌ [GuestAuth] Ошибка при создании гостя:", error);
        }
      } else {
        console.log("👤 [GuestAuth] userId найден в localStorage:", userId);
      }
    };

    checkGuestUser();
  }, [isAuthenticated, user, setUser, setTokens]);

  return <>{children}</>;
}
