import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "../config/apiClient";

export const getUserId = async (): Promise<string> => {
  if (typeof window === "undefined")
    throw new Error("❌ getUserId called on server");

  const { user, setUser } = useAuthStore.getState();
  const isNumber = (val: string) => /^\d+$/.test(val);

  if (user?.id && isNumber(user.id.toString())) return user.id.toString();

  try {
    const response = await apiClient.get("/user/me");
    const fetchedUser = response.data;

    if (fetchedUser?.id && isNumber(fetchedUser.id.toString())) {
      setUser(fetchedUser);
      return fetchedUser.id.toString();
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.warn("🔒 [Auth] 401 Unauthorized, создаём гостя...");
    } else {
      console.warn("⚠️ [Auth] Ошибка при /user/me:", error);
    }
  }

  try {
    const res = await apiClient.post("/auth/guest");
    const guestUser = res.data;

    if (guestUser?.id && isNumber(guestUser.id.toString())) {
      setUser(guestUser);
      return guestUser.id.toString();
    }
    throw new Error("Некорректный ID гостя");
  } catch (error) {
    throw new Error("❌ Не удалось создать гостевого пользователя");
  }
};
