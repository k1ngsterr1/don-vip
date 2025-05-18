import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "../config/apiClient";

export const getUserId = async (): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error("❌ getUserId called on server");
  }

  const { user, setUser } = useAuthStore.getState();

  const isNumber = (val: string) => /^\d+$/.test(val);

  if (user?.id && isNumber(user.id.toString())) {
    console.log("✅ [Auth] user.id уже присутствует:", user.id);
    return user.id.toString();
  }

  console.log("🔍 [Auth] user.id отсутствует или некорректен. user:", user);

  try {
    console.log("🌐 [Auth] Отправляем запрос GET /user/me...");
    const currentUser = await apiClient.get("/user/me");
    const fetchedUser = currentUser.data;

    console.log("📥 [Auth] Ответ от /user/me:", fetchedUser);

    if (fetchedUser?.id && isNumber(fetchedUser.id.toString())) {
      setUser(fetchedUser);
      console.log("✅ [Auth] Получен текущий пользователь:", fetchedUser.id);
      return fetchedUser.id.toString();
    } else {
      console.warn(
        "⚠️ [Auth] Получен некорректный user.id от /user/me:",
        fetchedUser?.id
      );
    }
  } catch (err) {
    console.warn("⚠️ [Auth] Ошибка при запросе /user/me:", err);
  }

  try {
    console.log("🆕 [GuestAuth] Пытаемся создать гостевого пользователя...");
    const res = await apiClient.post("/auth/guest");
    const guestUser = res.data;

    console.log("📥 [GuestAuth] Ответ от /auth/guest:", guestUser);

    if (guestUser?.id && isNumber(guestUser.id.toString())) {
      setUser(guestUser);
      console.log("👤 [GuestAuth] Гость успешно создан с id:", guestUser.id);
      return guestUser.id.toString();
    } else {
      console.error("❌ [GuestAuth] Некорректный guestUser.id:", guestUser?.id);
      throw new Error("Некорректный ID гостя");
    }
  } catch (error) {
    console.error("❌ [GuestAuth] Ошибка при создании гостя:", error);
    throw new Error("Не удалось создать гостевого пользователя");
  }
};
