import { useQuery } from "@tanstack/react-query";
import { productService } from "../../api/product.api";

export const useProducts = (search?: string, limit = 10, page = 1) => {
  return useQuery({
    queryKey: ["products", search, limit, page],
    queryFn: () => productService.findAll(search, limit, page),
  });
};
