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
      console.log("🟡 [GuestAuth] Проверка состояния авторизации...");

      const authStorage = localStorage.getItem("auth-storage");

      // ✅ Если auth-storage уже есть — удалим устаревший userId
      if (authStorage && localStorage.getItem("userId")) {
        console.log(
          "🧹 [GuestAuth] Удаляем устаревший userId из localStorage..."
        );
        localStorage.removeItem("userId");
      }

      if (isAuthenticated || user) {
        console.log("✅ [GuestAuth] Пользователь уже авторизован:", user);
        return;
      }

      if (!authStorage) {
        console.log("🆕 [GuestAuth] Гость не найден, создаём нового...");

        try {
          const response = await apiClient.post("/auth/guest");

          console.log("📥 [GuestAuth] Ответ от API:", response.data);

          const { user: guestUser, accessToken, refreshToken } = response.data;

          setUser(guestUser);
          setTokens(accessToken, refreshToken);

          console.log("✅ [GuestAuth] Установлены пользователь и токены.");
        } catch (error) {
          console.error("❌ [GuestAuth] Ошибка при создании гостя:", error);
        }
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
