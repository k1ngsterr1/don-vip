import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "@/shared/config/apiClient";
import { getUserId } from "@/shared/hooks/use-get-user-id";
import { useQuery } from "@tanstack/react-query";

type OrdersResponse = any; // Replace with your actual OrdersResponse type

const getOrderHistory = async (
  page = 1,
  limit = 10,
  guestParams?: { userId: string }
): Promise<OrdersResponse> => {
  const isGuestAuth = useAuthStore.getState().isGuestAuth;

  if (isGuestAuth) {
    const userId = guestParams?.userId || (await getUserId());
    if (!userId) {
      throw new Error("userId is required for guest order history");
    }
    const response = await apiClient.get<OrdersResponse>(
      `/order/guest/history?userId=${userId}&page=${page}&limit=${limit}`
    );
    return response.data;
  }

  const response = await apiClient.get<OrdersResponse>(
    `/order/history?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const usePurchaseHistory = (
  page = 1,
  limit = 10,
  guestParams?: { userId: string }
) => {
  return useQuery({
    queryKey: [
      "purchaseHistory",
      page,
      limit,
      guestParams?.userId || getUserId(),
    ],
    queryFn: () => getOrderHistory(page, limit, guestParams),
  });
};
