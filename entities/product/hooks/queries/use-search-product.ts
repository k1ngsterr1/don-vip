"use client";

import { useDebounce } from "@/shared/hooks/use-debounce";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { productService } from "../../api/product.api";

export const useSearchProducts = (searchQuery: string, limit = 10) => {
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isSearching, setIsSearching] = useState(false);

  // Reset isSearching when search query changes
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return useQuery({
    queryKey: ["products", "search", debouncedSearch, limit],
    queryFn: () => productService.findAll(debouncedSearch, limit),
    enabled: !!debouncedSearch && debouncedSearch.length > 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    meta: {
      isSearching,
    },
  });
};
