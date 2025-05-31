import { useAuthStore } from "@/entities/auth/store/auth.store";
import { apiClient } from "@/shared/config/apiClient";
import { getUserId } from "@/shared/hooks/use-get-user-id";
import { useQuery } from "@tanstack/react-query";

type OrdersResponse = any;

const getOrderHistory = async (
  page = 1,
  limit = 10
): Promise<OrdersResponse> => {
  const response = await apiClient.get<OrdersResponse>(
    `/order/history?page=${page}&limit=${limit}`
  );
  console.log(response.data);
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
    queryFn: () => getOrderHistory(page, limit),
  });
};
