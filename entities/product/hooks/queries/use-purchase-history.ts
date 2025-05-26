// hooks/usePurchaseHistory.ts
import { apiClient } from "@/shared/config/apiClient";
import { useQuery } from "@tanstack/react-query";

export const usePurchaseHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["purchaseHistory", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/order/history`, {
        params: { page, limit },
      });
      return response.data;
    },
  });
};
