import { useQuery } from "@tanstack/react-query";
import { bankApi } from "../api/bank.api";
import { queryKeys } from "@/shared/config/queryKeys"; // Assuming queryKeys is set up

export function useGetActiveBanks() {
  return useQuery({
    queryKey: queryKeys.banks.active(), // Example: queryKeys.banks.active = () => ['banks', 'active']
    queryFn: bankApi.getActiveBanks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
