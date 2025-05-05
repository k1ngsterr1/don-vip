// lib/hooks/user/use-user-by-id.ts
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/shared/config/apiClient";
import type { User } from "@/entities/user/model/types";

// Fallback user data in case API fails
const fallbackUser = {
  id: "1",
  firstName: "",
  lastName: "",
  avatar: "",
  gender: "male" as const,
  birthDate: "",
  phone: "",
  email: "",
  socialProvider: "vk" as const,
};

/**
 * Fetch user by ID
 */
const fetchUserById = async (userId: string | number): Promise<User> => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

/**
 * Hook to fetch a user by ID using TanStack Query
 * @param userId The ID of the user to fetch
 */
export function useUserById(userId: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });

  return {
    user: data || fallbackUser,
    isLoading,
    error,
  };
}
