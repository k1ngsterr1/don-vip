import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/product.api";

export const useSmileProducts = () => {
  return useQuery({
    queryKey: ["smileProducts"],
    queryFn: () => productService.getSmileProducts(),
  });
};
