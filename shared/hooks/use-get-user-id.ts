import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "../config/apiClient";

export const getUserId = async (): Promise<string> => {
  if (typeof window === "undefined") {
    throw new Error("❌ getUserId called on server");
  }

  const { user, setUser } = useAuthStore.getState();

  const isNumber = (val: string) => /^\d+$/.test(val);

  if (user?.id && isNumber(user.id.toString())) {
    return user.id.toString();
  }


  try {
    const currentUser = await apiClient.get("/user/me");
    const fetchedUser = currentUser.data;


    if (fetchedUser?.id && isNumber(fetchedUser.id.toString())) {
      setUser(fetchedUser);
      return fetchedUser.id.toString();
    } else {
      console.warn(
        "⚠️ [Auth] Получен некорректный user.id от /user/me:",
        fetchedUser?.id
      );
    }
  } catch (err) {
  }

  try {
    const res = await apiClient.post("/auth/guest");
    const guestUser = res.data;


    if (guestUser?.id && isNumber(guestUser.id.toString())) {
      setUser(guestUser);
      return guestUser.id.toString();
    } else {
      throw new Error("Некорректный ID гостя");
    }
  } catch (error) {
    throw new Error("Не удалось создать гостевого пользователя");
  }
};
