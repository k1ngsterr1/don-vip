// lib/hooks/user/use-profile.ts
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
 * Fetch current user profile
 */
const fetchCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get("/user/me");
  return response.data;
};

/**
 * Fetch user by ID
 */
const fetchUserById = async (userId: string | number): Promise<User> => {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
};

/**
 * Hook to fetch user profile data using TanStack Query
 * @param userId Optional user ID. If provided, fetches that specific user.
 * If not provided, fetches the current user.
 */
export function useProfile(userId?: string | number) {
  const { data, isLoading, error } = useQuery({
    queryKey: userId ? ["user", userId] : ["user", "me"],
    queryFn: () => (userId ? fetchUserById(userId) : fetchCurrentUser()),
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
