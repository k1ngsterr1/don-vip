import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/product.api";

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.findOne(id),
    enabled: !!id,
  });
};
