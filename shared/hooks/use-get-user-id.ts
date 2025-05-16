import { apiClient } from "../config/apiClient";

export const getUserId = async (): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error("❌ getUserId called on server");
  }

  const userId = localStorage.getItem("userId");

  const isNumber = (val: string) => /^\d+$/.test(val);

  // Если userId отсутствует или не является числом — создаём гостевой аккаунт
  if (!userId || !isNumber(userId)) {
    if (userId) {
      console.warn("⚠️ [GuestAuth] Некорректный userId, удаляем...");
      localStorage.removeItem("userId");
    }

    console.log("🆕 [GuestAuth] Создание гостевого userId...");
    try {
      const res = await apiClient.post("/auth/guest");
      const { id } = res.data;

      localStorage.setItem("userId", id);
      console.log("💾 [GuestAuth] Сохранили новый userId:", id);
      return id;
    } catch (error) {
      console.error("❌ Ошибка при создании гостя:", error);
      throw new Error("Не удалось создать гостевого пользователя");
    }
  }

  return userId;
};
