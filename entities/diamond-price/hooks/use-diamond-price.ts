import { useQuery } from "@tanstack/react-query";
import { diamondPriceApi, DiamondPrice } from "@/shared/api/diamond-price";

export function useDiamondPrice(currency: string = "RUB") {
  return useQuery<DiamondPrice>({
    queryKey: ["diamond-price", currency],
    queryFn: () => diamondPriceApi.getActivePrice(currency),
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут (новое название вместо cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  });
}
