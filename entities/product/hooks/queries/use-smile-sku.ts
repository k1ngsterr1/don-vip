import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/product.api";

export const useSmileSKU = (apiGame: string) => {
  return useQuery({
    queryKey: ["smileSKU", apiGame],
    queryFn: () => productService.getSmileSKU(apiGame),
    enabled: !!apiGame,
  });
};
