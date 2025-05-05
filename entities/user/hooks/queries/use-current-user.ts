// lib/hooks/user/use-current-user.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<User> => {
      const response = await apiClient.get("/user/me");
      return response.data;
    },
  });
}
